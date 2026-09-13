import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const migration = await readFile(new URL('../supabase/migrations/20260913204749_restrict_admin_content_access.sql', import.meta.url), 'utf8');
const original = (await readFile(new URL('../supabase/migrations/20250905060000_full_reset.sql', import.meta.url), 'utf8'))
  .replace('CREATE EXTENSION IF NOT EXISTS pgcrypto;', '');

async function fixture() {
  const db = new PGlite();
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated;
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS
      $$ SELECT coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated;`);
  await db.exec(original);
  // A dashboard-created permissive policy must also be removed.
  await db.exec('CREATE POLICY extra_open_policy ON public.events FOR ALL TO public USING (true) WITH CHECK (true);');
  await db.exec(migration);
  return db;
}
async function asRole(db, role, claims = {}) {
  await db.exec('RESET ROLE');
  await db.query("SELECT set_config('request.jwt.claims', $1, false)", [JSON.stringify(claims)]);
  await db.exec(`SET ROLE ${role}`);
}

for (const role of ['anon', 'authenticated']) {
  test(`${role}: public reads and contact insert only; cannot spoof admin in user metadata`, async () => {
    const db = await fixture();
    try {
      await asRole(db, role, { user_metadata: { role: 'admin' } });
      for (const table of ['events', 'testimonials', 'editable_content']) {
        assert.ok((await db.query(`SELECT * FROM public.${table}`)).rows.length > 0);
        if (role === 'anon') {
          await assert.rejects(db.query(`DELETE FROM public.${table}`), /permission denied/);
          await assert.rejects(db.query(`UPDATE public.${table} SET id=id`), /permission denied/);
        } else {
          assert.equal((await db.query(`DELETE FROM public.${table} RETURNING id`)).rows.length, 0);
          assert.equal((await db.query(`UPDATE public.${table} SET id=id RETURNING id`)).rows.length, 0);
        }
      }
      await assert.rejects(db.query("INSERT INTO public.events (title,date,time,description) VALUES ('forbidden','2026-01-01','12:00','test')"));
      await assert.rejects(db.query("INSERT INTO public.testimonials (name,content) VALUES ('forbidden','test')"));
      await assert.rejects(db.query("INSERT INTO public.editable_content (section,content) VALUES ('forbidden','test')"));
      await db.query("INSERT INTO public.contact_submissions (name,message) VALUES ('SECURITY TEST','disposable local test')");
      if (role === 'anon') {
        for (const sql of ['SELECT * FROM', 'DELETE FROM', 'UPDATE']) {
          await assert.rejects(db.query(`${sql} public.contact_submissions ${sql === 'UPDATE' ? 'SET message=message' : ''}`), /permission denied/);
        }
      } else {
        assert.equal((await db.query('SELECT * FROM public.contact_submissions')).rows.length, 0);
        assert.equal((await db.query('DELETE FROM public.contact_submissions RETURNING id')).rows.length, 0);
        assert.equal((await db.query('UPDATE public.contact_submissions SET message=message RETURNING id')).rows.length, 0);
      }
      await asRole(db, 'authenticated', { app_metadata: { role: 'admin' } });
      assert.ok((await db.query('SELECT * FROM public.events')).rows.length > 0);
      assert.equal((await db.query('SELECT * FROM public.contact_submissions')).rows.length, 1);
    } finally { await db.close(); }
  });
}

test('authorized admin can create, update, upsert and delete content and manage contacts', async () => {
  const db = await fixture();
  try {
    await asRole(db, 'authenticated', { app_metadata: { role: 'admin' } });
    for (const [table, columns, values, update] of [
      ['events','title,date,time,description',"'SECURITY TEST','2026-01-01','12:00','test'","title='updated'"],
      ['testimonials','name,content',"'SECURITY TEST','test'","content='updated'"],
      ['editable_content','section,content',"'security_test','test'","content='updated'"],
      ['contact_submissions','name,message',"'SECURITY TEST','test'","message='updated'"],
    ]) {
      const { rows: [{ id }] } = await db.query(`INSERT INTO public.${table} (${columns}) VALUES (${values}) RETURNING id`);
      assert.equal((await db.query(`UPDATE public.${table} SET ${update} WHERE id=$1 RETURNING id`, [id])).rows.length, 1);
      if (table === 'editable_content') await db.query("INSERT INTO public.editable_content (section,content) VALUES ('security_test','upserted') ON CONFLICT (section) DO UPDATE SET content=excluded.content");
      assert.equal((await db.query(`DELETE FROM public.${table} WHERE id=$1 RETURNING id`, [id])).rows.length, 1);
    }
    await asRole(db, 'anon', { app_metadata: { role: 'admin' } });
    await assert.rejects(db.query('DELETE FROM public.events'), /permission denied/);
  } finally { await db.close(); }
});

test('migration preserves data, is repeatable, and enables RLS on all app tables', async () => {
  const db = await fixture();
  try {
    const before = (await db.query('SELECT count(*)::int AS count FROM public.events')).rows[0].count;
    await db.exec(migration);
    assert.equal((await db.query('SELECT count(*)::int AS count FROM public.events')).rows[0].count, before);
    assert.equal((await db.query("SELECT count(*)::int AS count FROM pg_class WHERE relname IN ('events','testimonials','editable_content','contact_submissions') AND relrowsecurity")).rows[0].count, 4);
  } finally { await db.close(); }
});
