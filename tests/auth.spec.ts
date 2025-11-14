import { test, expect } from '@playwright/test';
import { tester8 } from '../lib/utils/credentials';

test('Login to website', async ({ page }) => {
  // go to login page
  await page.goto('https://testing.muras.eu/');
  await page.getByRole('link', { name: 'Log in' }).click();

  // fill and submit login form
  await page.getByRole('textbox', { name: 'username' }).fill(tester8.email);
  await page.getByRole('textbox', { name: 'password' }).fill(tester8.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  expect(page.url()).toMatch('https://testing.muras.eu/my/');

  // save cookies to file
  await page.context().storageState({ path: 'playwright/.auth.json' });
});
