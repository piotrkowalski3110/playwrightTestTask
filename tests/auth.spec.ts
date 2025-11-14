import { test, expect } from '@playwright/test';
import { tester8 } from '../lib/utils/credentials';

test('Login to website', async ({ page }) => {
  await page.goto('https://testing.muras.eu/');

  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible();

  await page.getByRole('textbox', { name: 'username' }).fill(tester8.email);
  await page.getByRole('textbox', { name: 'password' }).fill(tester8.password);

  await Promise.all([page.waitForURL('**/my/'), page.getByRole('button', { name: 'Log in' }).click()]);

  await page.context().storageState({ path: 'playwright/.auth.json' });
});
