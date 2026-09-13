import { test, expect } from '@playwright/test';

const ref = 'shxmbqdeesfglpbjvofc';
const isLive = Boolean(process.env.TEST_BASE_URL?.startsWith('https://'));

test('public desktop navigation, reads and console @public', async ({ page }) => {
  const errors = [];
  const reads = [];
  const externalImageFailures = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && !message.location().url.startsWith('https://i.imgur.com/')) errors.push(message.text());
  });
  page.on('requestfailed', request => { if (request.url().includes(ref)) errors.push('Supabase request failed'); });
  page.on('response', response => {
    if (response.url().startsWith('https://i.imgur.com/') && response.status() >= 400) externalImageFailures.push(response.status());
    if (response.url().includes(ref)) {
      if (response.status() >= 400) errors.push(`Supabase HTTP ${response.status()}`);
      if (response.url().includes('/rest/v1/')) reads.push(new URL(response.url()).pathname);
    }
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Your Voice is your Superpower/i })).toBeVisible();
  for (const [nav, heading] of [
    ['About', /Meet Our Founder/], ['Information', /Information/], ['Events', /Event Calendar/],
    ['Testimonials', /Success Stories/], ['1-on-1', /1-on-1/],
  ]) {
    await page.locator('nav').getByRole('button', { name: nav, exact: true }).click();
    await expect(page.locator('h1')).toContainText(heading);
    await expect(page.getByText(/Loading (calendar|testimonials)/)).toHaveCount(0);
  }
  await page.locator('footer').getByRole('button', { name: 'Admin', exact: true }).click();
  await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toHaveCount(0);
  await expect.poll(() => reads.some(p => p.endsWith('/events')) && reads.some(p => p.endsWith('/testimonials')) && reads.some(p => p.endsWith('/editable_content'))).toBe(true);
  expect(errors).toEqual([]);
  if (externalImageFailures.length) test.info().annotations.push({ type: 'external-image-failure', description: `Imgur returned ${externalImageFailures.join(', ')}; unrelated to Supabase. Check original image hosting.` });
  await expect(page.locator('footer a[href*="object"]')).toHaveCount(0);
});

test('mobile navigation and calendar fit the viewport @public', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.locator('nav').getByRole('button', { name: 'Events', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Event Calendar' })).toBeVisible();
  await expect(page.getByText('Loading calendar...')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Contact Us', exact: true }).last().click();
  await expect(page.getByLabel('Your Name')).toBeVisible();
});

test('contact submission includes reply details and never reports a failed save as success', async ({ page }) => {
  test.skip(isLive, 'Mocked local form regression; production submission is a separate single disposable record.');
  let submitted;
  let fail = false;
  await page.route('**/rest/v1/contact_submissions*', async route => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ status: fail ? 403 : 201, contentType: 'application/json', body: fail ? JSON.stringify({ message: 'denied' }) : '' });
  });
  await page.goto('/');
  const fill = async () => {
    await page.getByRole('button', { name: 'Contact Us', exact: true }).last().click();
    await page.getByLabel('Your Name').fill('SECURITY TEST local only');
    await page.getByLabel('Email Address').fill('security-test@example.invalid');
    await page.getByLabel('Phone Number (Optional)').fill('0000000000');
    await page.getByLabel('Message', { exact: true }).fill('Disposable local form regression.');
    await page.getByRole('button', { name: 'Send Message' }).click();
  };
  await fill();
  await expect(page.getByText('Message Sent!')).toBeVisible();
  expect(submitted.email).toBe('security-test@example.invalid');
  expect(submitted.phone).toBe('0000000000');
  await expect(page.getByLabel('Your Name')).toHaveCount(0);
  fail = true;
  await fill();
  await expect(page.getByText(/There was an error sending/)).toBeVisible();
  await expect(page.getByText('Message Sent!')).toHaveCount(0);
});

for (const admin of [false, true]) {
  test(`Auth validates admin role with server; admin=${admin}; sign-out closes access`, async ({ page }) => {
    test.skip(isLive, 'Mocked Auth never runs against production.');
    const user = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'security-test@example.invalid', app_metadata: { role: 'admin' }, user_metadata: {}, created_at: new Date().toISOString() };
    await page.route('**/auth/v1/**', async route => {
      const path = new URL(route.request().url()).pathname;
      if (path.endsWith('/user')) return route.fulfill({ json: { ...user, app_metadata: admin ? { role: 'admin' } : {} } });
      if (path.endsWith('/logout')) return route.fulfill({ status: 204 });
      const encode = data => Buffer.from(JSON.stringify(data)).toString('base64url');
      const token = [encode({ alg: 'HS256', typ: 'JWT' }), encode({ exp: Math.floor(Date.now()/1000)+3600, sub: user.id, role: 'authenticated', app_metadata: user.app_metadata }), 'test-signature'].join('.');
      await route.fulfill({ json: { access_token: token, refresh_token: 'local-test-refresh', token_type: 'bearer', expires_in: 3600, user } });
    });
    await page.goto('/');
    await page.locator('nav').getByRole('button', { name: 'Login', exact: true }).click();
    await page.getByLabel('Email', { exact: true }).fill(user.email);
    await page.getByLabel('Password', { exact: true }).fill('local-test-password');
    await page.getByRole('button', { name: 'Access Admin Panel' }).click();
    if (admin) {
      await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
      let saved;
      await page.route('**/rest/v1/editable_content*', async route => {
        if (route.request().method() === 'POST') {
          saved = route.request().postDataJSON();
          return route.fulfill({ json: { id: '00000000-0000-4000-8000-000000000002' } });
        }
        await route.continue();
      });
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Edit Mission Statement', exact: true }).click();
      await page.locator('textarea').fill('SECURITY TEST local admin edit');
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      await expect.poll(() => saved?.content).toBe('SECURITY TEST local admin edit');
      expect(saved.section).toBe('mission');
      await page.getByRole('button', { name: 'Logout' }).click();
      await expect(page.getByRole('heading', { name: /Your Voice is your Superpower/i })).toBeVisible();
      await page.locator('footer').getByRole('button', { name: 'Admin', exact: true }).click();
    }
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toHaveCount(0);
  });
}

test('untrusted stored HTML cannot execute scripts', async ({ page }) => {
  test.skip(isLive, 'Local stored-XSS regression only.');
  await page.route('**/rest/v1/editable_content*', async route => {
    const url = new URL(route.request().url());
    const section = url.searchParams.get('section');
    if (section?.includes('about_founder')) return route.fulfill({ json: { content: '<p>Safe rich text</p><img src=x onerror="window.securityTestXss=true"><script>window.securityTestXss=true</script>' } });
    await route.continue();
  });
  await page.goto('/');
  await page.locator('nav').getByRole('button', { name: 'About', exact: true }).click();
  await expect(page.getByText('Safe rich text')).toBeVisible();
  expect(await page.evaluate(() => window.securityTestXss)).toBeUndefined();
  await expect(page.locator('main [onerror], main script')).toHaveCount(0);
});
