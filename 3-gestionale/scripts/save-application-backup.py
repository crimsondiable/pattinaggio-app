#!/usr/bin/env python3
"""Save one connected Supabase execute_sql response from stdin. Never prints rows."""
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
PROJECT = 'mhioneawefsvagbccsum'


def decode_response(response):
    if response.get('isError'):
        raise ValueError('Supabase tool returned an error')
    for block in response.get('content', []):
        if block.get('type') != 'text':
            continue
        envelope = json.loads(block['text'])
        result = envelope.get('result', '')
        match = re.search(r'^<untrusted-data-[^>]+>\s*(.*?)\s*</untrusted-data-[^>]+>', result, re.S | re.M)
        if not match:
            continue
        records = json.loads(match.group(1))
        if len(records) == 1 and 'snapshot_base64' in records[0]:
            return records[0]
    raise ValueError('Missing or truncated snapshot response')


def save(response):
    record = decode_response(response)
    raw = base64.b64decode(''.join(record['snapshot_base64'].split()), validate=True)
    if hashlib.md5(raw).hexdigest() != record['snapshot_md5']:
        raise ValueError('Snapshot checksum does not match the server')
    snapshot = json.loads(raw)
    if snapshot['project_ref'] != PROJECT or snapshot['format'] != 'pattinaggio-application-snapshot-v1':
        raise ValueError('Unexpected snapshot project or format')
    tables = snapshot['tables']
    if len(tables) != record['table_count'] or len({t['name'] for t in tables}) != len(tables):
        raise ValueError('Invalid table count or duplicate tables')
    for table in tables:
        if table['schema'] != 'public' or len(table['rows']) != table['row_count']:
            raise ValueError('Table row count mismatch')
        columns = {column['name'] for column in table['columns']}
        if any(set(row) != columns for row in table['rows']):
            raise ValueError('Row columns do not match schema')
    total = sum(t['row_count'] for t in tables)
    if total != record['total_rows'] or not {'allievi','lezioni','lezioni_allievi','skills'}.issubset({t['name'] for t in tables}):
        raise ValueError('Incomplete application snapshot')
    stamp = datetime.now(ZoneInfo('Europe/Rome')).strftime('%Y-%m-%d_%H%M%S')
    directory = ROOT / 'backups' / f'supabase-app-{stamp}'
    os.umask(0o077)
    directory.mkdir(mode=0o700, parents=True, exist_ok=False)
    (directory / 'snapshot.json').write_bytes(raw)
    shutil.copytree(ROOT / 'supabase' / 'migrations', directory / 'canonical-migrations')
    shutil.copy2(ROOT / '3-gestionale' / 'scripts' / 'backup-application.sql', directory / 'export-query.sql')
    manifest = {
        'project_ref': PROJECT, 'captured_at': snapshot['captured_at'],
        'format': snapshot['format'], 'table_count': len(tables), 'total_rows': total,
        'rows_by_table': {t['name']: t['row_count'] for t in tables},
        'storage_object_count': snapshot['storage_object_count'],
        'migration_history_count': len(snapshot['migration_history']),
        'verification': 'Server MD5, local SHA256, JSON parsing, column sets and exact row counts; no restore performed',
        'scope': snapshot['scope'], 'restore_tested': False,
    }
    (directory / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    (directory / 'README.md').write_text(
        '# Copia dati applicativi Pattinaggio\n\n'
        'Snapshot coerente in transazione di sola lettura di tutte le tabelle public, '
        'con metadati dello schema remoto e cronologia migrazioni.\n\n'
        'Non è un dump pg_dump né un backup completo Supabase. Sono esclusi dati Auth '
        '(password e sessioni), file Storage, configurazione server e bozze browser. '
        'I metadati live e le migrazioni servono come riferimento; le migrazioni non sono '
        'state provate su un database vuoto. Nessun ripristino è stato eseguito.\n\n'
        'Per recuperare una scheda: leggere la riga originale da snapshot.json, verificare '
        'il suo id e confrontarla con il dato remoto; preparare un aggiornamento mirato '
        'da approvare prima di scrivere. Per un ripristino totale predisporre un ambiente '
        'isolato, ricostruire e verificare lo schema e risolvere i riferimenti ad auth.users '
        'prima di importare le righe rispettando le chiavi esterne. Non applicare questa '
        'copia automaticamente alla produzione.\n\n'
        'Dati personali: non pubblicare e non aggiungere a Git. Copia locale sul Mac; '
        'non protegge dalla perdita del Mac. Conservare anche una copia separata protetta.\n'
    )
    checksums = []
    for path in sorted(directory.rglob('*')):
        if path.is_file():
            path.chmod(0o600)
            checksums.append(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(directory)}')
        elif path.is_dir():
            path.chmod(0o700)
    (directory / 'checksums.sha256').write_text('\n'.join(checksums) + '\n')
    print(json.dumps({'directory': str(directory), 'tables': len(tables), 'rows': total,
                      'bytes': len(raw), 'storage_objects': snapshot['storage_object_count'],
                      'verified': True}))


if __name__ == '__main__':
    save(json.load(sys.stdin))
