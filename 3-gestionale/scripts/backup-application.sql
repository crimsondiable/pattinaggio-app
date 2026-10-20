-- Read-only application snapshot. Execute through the connected Supabase tool.
-- This is not pg_dump and excludes auth sessions/passwords and Storage files.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
WITH tables AS MATERIALIZED (
  SELECT c.oid, n.nspname AS schema_name, c.relname AS table_name,
         c.relrowsecurity AS rls_enabled, c.relforcerowsecurity AS rls_forced,
         c.relacl::text AS acl
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
), exported AS MATERIALIZED (
  SELECT t.*, (
    SELECT coalesce(jsonb_agg(record::jsonb ORDER BY record), '[]'::jsonb)
    FROM XMLTABLE('/table/row' PASSING query_to_xml(
      format('SELECT to_jsonb(t)::text AS record FROM %I.%I t', schema_name, table_name),
      false, false, '') COLUMNS record text PATH 'record') records
  ) AS rows
  FROM tables t
), snapshot AS (
  SELECT jsonb_build_object(
    'format', 'pattinaggio-application-snapshot-v1',
    'project_ref', 'mhioneawefsvagbccsum',
    'captured_at', transaction_timestamp(),
    'database_version', version(),
    'scope', 'All public table data and live application schema metadata; no auth data, Storage files, browser drafts or server configuration',
    'tables', (SELECT jsonb_agg(jsonb_build_object(
      'schema', e.schema_name, 'name', e.table_name,
      'rls_enabled', e.rls_enabled, 'rls_forced', e.rls_forced, 'acl', e.acl,
      'row_count', jsonb_array_length(e.rows), 'rows', e.rows,
      'columns', (SELECT jsonb_agg(jsonb_build_object(
        'name', a.attname, 'type', format_type(a.atttypid, a.atttypmod),
        'nullable', NOT a.attnotnull, 'generated', a.attgenerated, 'identity', a.attidentity,
        'default', pg_get_expr(d.adbin, d.adrelid)
      ) ORDER BY a.attnum) FROM pg_attribute a
      LEFT JOIN pg_attrdef d ON d.adrelid=a.attrelid AND d.adnum=a.attnum
      WHERE a.attrelid=e.oid AND a.attnum>0 AND NOT a.attisdropped),
      'constraints', (SELECT coalesce(jsonb_agg(jsonb_build_object(
        'name', conname, 'type', contype, 'definition', pg_get_constraintdef(oid),
        'referenced_table', CASE WHEN confrelid<>0 THEN confrelid::regclass::text ELSE NULL END
      ) ORDER BY conname), '[]'::jsonb) FROM pg_constraint WHERE conrelid=e.oid),
      'indexes', (SELECT coalesce(jsonb_agg(indexdef ORDER BY indexname), '[]'::jsonb)
                  FROM pg_indexes WHERE schemaname=e.schema_name AND tablename=e.table_name),
      'triggers', (SELECT coalesce(jsonb_agg(pg_get_triggerdef(oid) ORDER BY tgname), '[]'::jsonb)
                   FROM pg_trigger WHERE tgrelid=e.oid AND NOT tgisinternal)
    ) ORDER BY e.schema_name,e.table_name) FROM exported e),
    'policies', (SELECT coalesce(jsonb_agg(to_jsonb(p) ORDER BY tablename,policyname), '[]'::jsonb)
                 FROM pg_policies p WHERE schemaname='public'),
    'functions', (SELECT coalesce(jsonb_agg(jsonb_build_object(
      'identity', p.oid::regprocedure::text, 'definition', pg_get_functiondef(p.oid), 'acl', p.proacl::text
    ) ORDER BY p.oid::regprocedure::text), '[]'::jsonb)
      FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
      WHERE n.nspname='public' AND p.prokind IN ('f','p')),
    'enums', (SELECT coalesce(jsonb_agg(to_jsonb(e)), '[]'::jsonb) FROM (
      SELECT t.typname, array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels
      FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace JOIN pg_enum e ON e.enumtypid=t.oid
      WHERE n.nspname='public' GROUP BY t.typname ORDER BY t.typname) e),
    'views', (SELECT coalesce(jsonb_agg(to_jsonb(v)), '[]'::jsonb) FROM pg_views v WHERE schemaname='public'),
    'sequences', (SELECT coalesce(jsonb_agg(to_jsonb(s)), '[]'::jsonb) FROM pg_sequences s WHERE schemaname='public'),
    'grants', (SELECT coalesce(jsonb_agg(to_jsonb(g)), '[]'::jsonb) FROM information_schema.table_privileges g WHERE table_schema='public'),
    'extensions', (SELECT jsonb_agg(jsonb_build_object('name',extname,'version',extversion) ORDER BY extname) FROM pg_extension),
    'migration_history', (SELECT coalesce(jsonb_agg(to_jsonb(m) ORDER BY version), '[]'::jsonb) FROM supabase_migrations.schema_migrations m),
    'storage_object_count', (SELECT count(*) FROM storage.objects)
  ) AS body
)
SELECT encode(convert_to(body::text, 'UTF8'), 'base64') AS snapshot_base64,
       md5(body::text) AS snapshot_md5,
       (SELECT count(*) FROM exported) AS table_count,
       (SELECT sum(jsonb_array_length(rows)) FROM exported) AS total_rows
FROM snapshot;
COMMIT;
