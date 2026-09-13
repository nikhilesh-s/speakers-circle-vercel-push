-- Apply only to shxmbqdeesfglpbjvofc after reviewing the live schema.
-- This migration changes policies/grants only; it never resets or seeds data.
-- Admin accounts must have server-controlled app_metadata.role = 'admin'.
BEGIN;

-- Fail closed on an unexpected/missing schema rather than partially applying.
DO $$
DECLARE table_name text;
DECLARE policy_record record;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['events', 'testimonials', 'editable_content', 'contact_submissions'] LOOP
    IF NOT EXISTS (
      SELECT FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname = table_name AND c.relkind = 'r'
    ) THEN
      RAISE EXCEPTION 'Expected public table % is missing; review the live schema', table_name;
    END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    -- Remove ALL old policies on these four app tables, including permissive
    -- policies renamed in the dashboard. Policies combine with OR by default.
    FOR policy_record IN SELECT policyname FROM pg_policies
      WHERE schemaname = 'public' AND tablename = table_name
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', policy_record.policyname, table_name);
    END LOOP;
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated', table_name);
  END LOOP;
END $$;

GRANT SELECT ON public.events, public.testimonials, public.editable_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events, public.testimonials, public.editable_content TO authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['events', 'testimonials', 'editable_content'] LOOP
    EXECUTE format('CREATE POLICY public_read ON public.%I FOR SELECT TO anon, authenticated USING (true)', table_name);
    EXECUTE format($policy$CREATE POLICY admin_insert ON public.%I FOR INSERT TO authenticated
      WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')$policy$, table_name);
    EXECUTE format($policy$CREATE POLICY admin_update ON public.%I FOR UPDATE TO authenticated
      USING (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
      WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')$policy$, table_name);
    EXECUTE format($policy$CREATE POLICY admin_delete ON public.%I FOR DELETE TO authenticated
      USING (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')$policy$, table_name);
  END LOOP;
END $$;

CREATE POLICY contact_submit ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(trim(name)) BETWEEN 1 AND 200
    AND char_length(trim(message)) BETWEEN 1 AND 10000);
CREATE POLICY contact_admin_read ON public.contact_submissions FOR SELECT TO authenticated
  USING (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY contact_admin_update ON public.contact_submissions FOR UPDATE TO authenticated
  USING (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY contact_admin_delete ON public.contact_submissions FOR DELETE TO authenticated
  USING (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
COMMIT;
