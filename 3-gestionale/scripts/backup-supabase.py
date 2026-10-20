#!/usr/bin/env python3
"""Private read-only PostgreSQL backup using existing Supabase CLI credentials."""
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import subprocess
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
PROJECT = 'mhioneawefsvagbccsum'
CLIENT = ROOT / 'backups' / '.postgres-client'
BIN = CLIENT / 'libpq' / '18.6' / 'bin'
SCHEMAS = ['public', 'auth', 'storage', 'supabase_migrations']


def run_backup():
    os.umask(0o077)
    linked = (ROOT / 'supabase' / '.temp' / 'project-ref').read_text().strip()
    if linked != PROJECT:
        raise RuntimeError('Linked Supabase project differs from the authorized project')
    for name in ['pg_dump', 'pg_restore', 'psql']:
        if not (BIN / name).is_file():
            raise RuntimeError('PostgreSQL backup client missing; do not install or start services automatically')
    plan = subprocess.run(['supabase', 'db', 'dump', '--linked', '--dry-run'],
                          cwd=ROOT, capture_output=True, text=True, timeout=90)
    if plan.returncode:
        raise RuntimeError('Supabase CLI login unavailable; no backup completed. Reconnect the existing account.')
    env = os.environ.copy()
    # Never execute the dry-run script: extract only its quoted connection settings.
    required = {'PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'}
    found = {}
    for name, value in re.findall(r'^export (PG\w+)=(.*)$', plan.stdout, re.M):
        if name in required:
            values = shlex.split(value)
            if len(values) != 1:
                raise RuntimeError('Unexpected Supabase connection setting format')
            found[name] = values[0]
    if set(found) != required:
        raise RuntimeError('Incomplete Supabase connection settings')
    env.update(found)
    env['PGOPTIONS'] = '-c default_transaction_read_only=on'
    env['PGCONNECT_TIMEOUT'] = '20'
    env['DYLD_LIBRARY_PATH'] = ':'.join([
        str(CLIENT / 'libpq' / '18.6' / 'lib'), str(CLIENT / 'krb5' / '1.22.2' / 'lib'),
        '/opt/homebrew/opt/openssl@3/lib', '/opt/homebrew/opt/icu4c@78/lib',
        '/opt/homebrew/opt/readline/lib',
    ])
    stamp = datetime.now(ZoneInfo('Europe/Rome')).strftime('%Y-%m-%d_%H%M%S')
    out = ROOT / 'backups' / f'supabase-db-{stamp}'
    out.mkdir(mode=0o700, parents=True, exist_ok=False)
    try:
        subprocess.run([str(BIN/'pg_dump'), '--format=custom', '--no-owner', '--no-privileges',
                        '--role=postgres', *['--schema='+schema for schema in SCHEMAS],
                        '--file='+str(out/'database.dump')], env=env, check=True, timeout=600,
                       stdout=subprocess.DEVNULL)
        # Decode every archive entry without executing any SQL against a database.
        subprocess.run([str(BIN/'pg_restore'), '--file=/dev/null', str(out/'database.dump')],
                       env=env, check=True, timeout=120, stdout=subprocess.DEVNULL)
        toc = subprocess.check_output([str(BIN/'pg_restore'), '--list', str(out/'database.dump')],
                                      env=env, text=True, timeout=30)
        entries = [line for line in toc.splitlines() if ' TABLE DATA public ' in line]
        query = "select count(*) from pg_tables where schemaname='public'"
        live_count = int(subprocess.check_output([
            str(BIN/'psql'), '-X', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c', query],
            env=env, text=True, timeout=30).strip())
        if not entries or len(entries) != live_count:
            raise RuntimeError('Backup public table count differs from live schema')
        (out/'database-toc.txt').write_text(toc)
        shutil.copytree(ROOT/'supabase'/'migrations', out/'canonical-migrations')
        receipt = {
            'project_ref': PROJECT, 'created_at': datetime.now(ZoneInfo('Europe/Rome')).isoformat(),
            'format': 'pg_dump custom', 'schemas': SCHEMAS, 'public_tables': live_count,
            'dump_bytes': (out/'database.dump').stat().st_size,
            'archive_decode_verified': True, 'restore_tested': False,
            'exclusions': ['Storage file contents', 'managed internal schemas outside the four listed',
                           'server configuration', 'role passwords', 'browser localStorage'],
        }
        (out/'manifest.json').write_text(json.dumps(receipt, indent=2)+'\n')
        (out/'README.md').write_text(
            '# Backup PostgreSQL Pattinaggio\n\n'
            'Archivio pg_dump dei quattro schemi elencati nel manifest, inclusi dati Auth. '
            'Dati sensibili: non pubblicare né aggiungere a Git. Lettura/decompressione integrale '
            'verificata, conteggio tabelle public confrontato col remoto; nessun ripristino eseguito. '
            'Prima di ripristinare, provare su un progetto isolato compatibile Supabase e verificare '
            'ruoli, estensioni, proprietari, permessi e schema gestito della piattaforma. '
            'Non eseguire pg_restore sulla produzione senza un intervento approvato separatamente.\n\n'
            'Copia locale: non copre perdita o guasto del Mac. Nessun file Storage, '
            'configurazione server o bozza browser incluso. Nessuna cancellazione automatica '
            'delle copie precedenti.\n'
        )
        checksums = []
        for path in sorted(out.rglob('*')):
            if path.is_file():
                path.chmod(0o600)
                checksums.append(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.relative_to(out)}')
            elif path.is_dir():
                path.chmod(0o700)
        (out/'checksums.sha256').write_text('\n'.join(checksums)+'\n')
        (out/'COMPLETE').write_text('archive decoded; live table count matched; checksums saved\n')
        print(json.dumps({'directory': str(out), 'public_tables': live_count,
                          'archive_verified': True, 'restore_tested': False}))
    except Exception:
        (out/'INCOMPLETE').write_text('Backup failed. Do not treat this directory as a completed backup.\n')
        raise


if __name__ == '__main__':
    run_backup()
