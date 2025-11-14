import { test, expect } from '@playwright/test';
import { fakerPL } from '@faker-js/faker';

test.use({ storageState: 'playwright/.auth.json' });

test('Course management page', async ({ page }) => {
  await page.goto('https://testing.muras.eu/course/management.php'); // go to management page

  const categoryItems = page.locator('#course-listing .card-body ul li'); // locate course items
  const count = await categoryItems.count(); // count course items
  expect(count).toBeGreaterThan(0); // check if there are more than 0 items
  const randomIndex = Math.floor(Math.random() * count); // generate random index

  await categoryItems.nth(randomIndex).locator('.custom-checkbox').click(); // click checkbox
  await expect(categoryItems.nth(randomIndex).locator('input')).toBeChecked(); // check if checkbox is checked
});

test('Specific course page', async ({ page }) => {
  await page.goto('https://testing.muras.eu/course/view.php?id=7'); // go to course management page

  const checkboxEditMode = page.getByRole('checkbox', { name: 'Edit mode' }); // get edit mode checkbox
  await checkboxEditMode.setChecked(true); // set checkbox state to true
  await expect(checkboxEditMode).toBeChecked(); // check if checkbox is checked

  await page.getByRole('button', { name: 'Add an activity or resource' }).nth(1).click(); // click second add activity button
  await expect(page.locator('.modal-content')).toBeVisible(); // check if modal is visible
  await page.getByLabel('Activity modules').getByRole('link', { name: 'Text and media area' }).click(); // click text and media area

  const loremWord = fakerPL.lorem.word();
  const loremLines = fakerPL.lorem.lines();
  await page.locator('#fitem_id_name input').fill(loremWord); // fill title with one world
  await page.getByRole('textbox', { name: 'Text' }).fill(loremLines); // fill text with lorem lines
  await page.getByRole('button', { name: 'Save and return to course' }).click(); // submit changes

  expect(page.url()).toMatch('https://testing.muras.eu/course/view.php?id=7'); // go back to course management page
  await expect(page.locator(`[data-activityname="${loremWord}"]`)).toBeVisible(); // check if title is created
  await expect(page.getByText(loremLines)).toBeVisible(); // check if text is visible and created
});
