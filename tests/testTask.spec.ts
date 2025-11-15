import { test, expect, Locator } from '@playwright/test';
import { fakerPL } from '@faker-js/faker';

test.use({ storageState: 'playwright/.auth.json' });

test('Course management page - random checkbox', async ({ page }) => {
  await page.goto('https://testing.muras.eu/course/management.php');
  const categoryItems: Locator = page.locator('#course-listing .card-body ul li');
  const count: number = await categoryItems.count();
  expect(count).toBeGreaterThan(0);
  const randomIndex: number = Math.floor(Math.random() * count);
  await categoryItems.nth(randomIndex).locator('.custom-checkbox').click();
  await expect(categoryItems.nth(randomIndex).locator('input')).toBeChecked();
});

test.describe.serial('Create + clean up test', () => {
  const loremWord: string = fakerPL.animal.dog();
  const loremLines: string = fakerPL.animal.cat();

  test('Add activity or resource to course', async ({ page }) => {
    await page.goto('https://testing.muras.eu/course/view.php?id=7');
    await page.waitForURL('**/course/view.php?id=7');

    const checkboxEditMode: Locator = page.getByRole('checkbox', { name: 'Edit mode' });
    await checkboxEditMode.setChecked(true);
    await expect(checkboxEditMode).toBeChecked();
    await page.getByRole('button', { name: 'Add an activity or resource' }).first().click();
    await page.getByLabel('Activity modules').getByRole('link', { name: 'Text and media area' }).click();

    await Promise.all([
      page.waitForURL('**/course/modedit**'),
      page.locator('#fitem_id_name input').fill(loremWord),
      page.getByRole('textbox', { name: 'Text' }).fill(loremLines),
      page.waitForTimeout(500),
    ]);

    await page.getByRole('button', { name: 'Save and return to course' }).click();

    await Promise.all([
      page.waitForURL('**/course/view.php?id=7'),
      expect(page.locator('div.no-overflow').getByText(loremWord + loremLines)).toBeVisible(),
    ]);
  });

  test('Clean up created content', async ({ page }) => {
    await page.goto('https://testing.muras.eu/course/view.php?id=7');
    const elementToDelete: Locator = page.locator(`[data-activityname="${loremWord + loremLines}"]`);
    const optionsMenuButton: Locator = elementToDelete.locator('.activity-actions.bulk-hidden.align-self-start.ms-sm-2');
    const deleteButton: Locator = optionsMenuButton.getByText('Delete');
    await optionsMenuButton.click();
    await deleteButton.click();

    const deleteModal: Locator = page.locator('.modal-dialog');
    await expect(deleteModal).toBeVisible();
    await expect(page.getByText(`This will delete ${loremWord + loremLines} and any user data it contains.`)).toBeVisible();
    await deleteModal.locator('button.btn-danger').click();
  });
});
