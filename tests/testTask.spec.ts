import { test, expect, Locator } from '@playwright/test';
import { fakerPL } from '@faker-js/faker';

test.use({ storageState: 'playwright/.auth.json' });
const loremWord: string = fakerPL.lorem.word();
const loremLines: string = fakerPL.lorem.lines();

test('Course management page', async ({ page }) => {
  await page.goto('https://testing.muras.eu/course/management.php'); // go to management page

  const categoryItems: Locator = page.locator('#course-listing .card-body ul li'); // locate course items
  const count: number = await categoryItems.count(); // count course items
  expect(count).toBeGreaterThan(0); // check if there are more than 0 items
  const randomIndex: number = Math.floor(Math.random() * count); // generate random index

  await categoryItems.nth(randomIndex).locator('.custom-checkbox').click(); // click checkbox
  await expect(categoryItems.nth(randomIndex).locator('input')).toBeChecked(); // check if checkbox is checked
});

test.describe.serial('Create + clean up test', () => {
  test('Add activity or resource to course', async ({ page }) => {
    await page.goto('https://testing.muras.eu/course/view.php?id=7'); // go to course management page

    const checkboxEditMode: Locator = page.getByRole('checkbox', { name: 'Edit mode' }); // get edit mode checkbox
    await checkboxEditMode.setChecked(true); // set checkbox state to true
    await expect(checkboxEditMode).toBeChecked(); // check if checkbox is checked

    await page.getByRole('button', { name: 'Add an activity or resource' }).nth(1).click(); // click second add activity button
    //await page.waitForTimeout(2000);
    //await expect(page.locator('.modal-content')).toBeVisible(); // check if modal is visible
    await page.getByLabel('Activity modules').getByRole('link', { name: 'Text and media area' }).click(); // click text and media area

    await page.locator('#fitem_id_name input').fill(loremWord); // fill title with one world
    await page.getByRole('textbox', { name: 'Text' }).fill(loremLines); // fill text with lorem lines
    await page.getByRole('button', { name: 'Save and return to course' }).click(); // submit changes

    expect(page.url()).toMatch('https://testing.muras.eu/course/view.php?id=7'); // go back to course management page
    await expect(page.locator(`[data-activityname="${loremWord}"]`)).toBeVisible(); // check if title is created
    await expect(page.getByText(loremLines)).toBeVisible(); // check if text is visible and created
  });

  test('Clean up created content', async ({ page }) => {
    await page.goto('https://testing.muras.eu/course/view.php?id=7'); // go to course management page

    const checkboxEditMode: Locator = page.getByRole('checkbox', { name: 'Edit mode' }); // get edit mode checkbox
    await checkboxEditMode.setChecked(true); // set checkbox state to true
    await expect(checkboxEditMode).toBeChecked(); // check if checkbox is checked

    const elementToDelete: Locator = page.locator(`[data-activityname="${loremWord}"]`); // locate previously created activity
    const optionsMenuButton: Locator = elementToDelete.locator('.activity-actions.bulk-hidden.align-self-start.ms-sm-2'); // locate options menu button
    const deleteButton: Locator = optionsMenuButton.getByText('Delete'); // locate delete button

    await optionsMenuButton.click(); // click options menu button
    await deleteButton.click(); // click delete button

    const deleteModal: Locator = page.locator('.modal-dialog'); // locate delete modal
    //await page.waitForTimeout(2000);
    //await expect(deleteModal).toBeVisible(); // check if modal is visible
    await deleteModal.locator('button.btn-danger').click(); // delete content
  });
});
