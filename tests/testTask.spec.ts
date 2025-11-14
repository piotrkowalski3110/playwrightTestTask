import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth.json' });

test('Course management', async ({ page }) => {
  await page.goto('https://testing.muras.eu/course/management.php'); // go to management page
  const categoryItems = page.locator('#course-listing .card-body ul li'); // locate course items
  const count = await categoryItems.count(); // count course items
  expect(count).toBeGreaterThan(0); // check if there are more than 0 items
  const randomIndex = Math.floor(Math.random() * count); // generate random index
  await categoryItems.nth(randomIndex).locator('.custom-checkbox').click(); // click checkbox
  await expect(categoryItems.nth(randomIndex).locator('input')).toBeChecked(); // check if checkbox is checked
});
