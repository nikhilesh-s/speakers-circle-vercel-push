# Security remediation handoff

Target: `nikhilesh-s/speakers-circle-vercel-push`, Supabase project
`shxmbqdeesfglpbjvofc`, Vercel project `speakers-circle-vercel-push`.

## Completed in source

The browser accepts only `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY`. Builds reject missing/incorrect public
configuration. Local environment files remain ignored and untracked.

Administrator sign-in uses Supabase Auth email/password. The admin screen
validates the user with Auth and checks the server-controlled
`app_metadata.role === 'admin'`. User-editable metadata is never authorization.
The old embedded passcode is removed. The browser guard is a UI check; RLS is
required to prevent direct API writes. Existing admin operators need a Supabase
Auth account with the admin role before they can use the new admin screen.

Rich text from the database is sanitized with DOMPurify at rendering and editor
boundaries. Contact submissions preserve email and phone and show an error when
saving fails; they no longer launch an email application or claim false success.

## Supabase owner actions (not applied remotely)

Administrative access to this exact project was denied. Do not apply the old
`20250905060000_full_reset.sql` to production: it deletes and reseeds tables.

1. In Authentication > Users, provision or select the intended administrator's
   email/password account. Do not reuse the former browser passcode. Set its
   **app metadata** `role` to `admin` via an authenticated management operation,
   or use the SQL Editor below with that user's verified UUID:

   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
       || jsonb_build_object('role', 'admin')
   WHERE id = '<verified-admin-user-uuid>'::uuid;
   ```

   Do not substitute user metadata. The administrator must sign out/in after
   a role change so their access token carries the new role. Role revocation
   also requires attention to already-issued token expiry/session revocation.

2. Inspect the live definitions and grants for `events`, `testimonials`,
   `editable_content`, and `contact_submissions`. Review and apply only
   `supabase/migrations/20260913204749_restrict_admin_content_access.sql`.
   It preserves data and replaces policies/grants on these four tables.
   Public users retain content reads and contact insertion. Only authenticated
   admins can change content or read/manage contact submissions.
   The migration passed local Postgres-compatible RLS tests; this does not
   substitute for checking the production schema, custom views, functions,
   other exposed tables, column-level grants, and existing database owners.

3. Sign in as the administrator and verify create/update/delete operations.
   Verify anonymous and ordinary authenticated clients cannot modify content
   or enumerate/update/delete contact submissions. Run Security Advisor and
   review API/Auth/database logs for misuse. Available access did not permit
   an audit review; no absence-of-misuse conclusion has been made.

4. Production's modern publishable key has been verified with public reads.
   In Settings > API Keys, deactivate the legacy JWT-based API keys. Check
   other integrations first and migrate any remaining legacy consumers. If
   the dashboard requires legacy signing-secret rotation, complete that
   migration before rotation. Never recover or test the exposed credential.
   Repeat the public and admin smoke tests after invalidation.

References: [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys),
[password authentication](https://supabase.com/docs/guides/auth/passwords),
[RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Dependencies

The audit started with 25 findings (0 critical, 15 high, 7 moderate, 3 low).
Compatible upgrades leave 4 (0 critical, 1 high, 3 moderate): Vite/esbuild
and Quill/ReactQuill. No force/major upgrade was used. The unused direct Quill 2
installation was removed; ReactQuill still depends on Quill 1.

Vite/esbuild findings concern development-server exposure; Vercel serves the
built static output, not the Vite development server. Keep local tooling bound
to loopback and avoid exposing it publicly. Upgrade Vite as a separately tested
major-version change. The Quill stored-HTML risk is mitigated by sanitization
and admin access controls, but the package advisory remains; replacing the
editor requires a separate compatibility check.

[Quill advisory](https://github.com/advisories/GHSA-4943-9vgg-gr5r),
[Vite advisory](https://github.com/advisories/GHSA-4w7w-66w2-5vf9),
[DOMPurify](https://github.com/cure53/DOMPurify).

## Verification commands

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm test` (local RLS tests with PGlite)
- `npm run build` (requires the two public environment variables)
- `npm run preview -- --host 127.0.0.1 --port 4173`
- `npm run test:e2e` (local browser regressions; mock Auth tests never run live)
- `TEST_BASE_URL=https://www.speakerscircle.org npm run test:e2e -- --grep @public`
- `gitleaks git --redact=100 --log-opts=--all .`

The RLS fixture simulates Supabase's verified JWT claims; it does not test Auth's
signature verification itself. Browser mock tests are regression checks and do
not establish that production admin accounts or RLS are configured.

Git history was already rewritten. Do not push any local backup refs or merge
old history back. GitHub Support may still need to purge retained sensitive
commit views from the earlier incident; history rewriting does not invalidate
credentials.

## External image hosting

The existing Imgur logo/portrait endpoints returned HTTP 403 during browser
verification. Tests record these separately from application and Supabase
failures. Original media URLs were preserved; the site owner should restore
availability or supply replacement assets for reliable image rendering.
