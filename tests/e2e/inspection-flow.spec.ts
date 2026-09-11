import { expect, test } from '@playwright/test';

test('creates, edits, compares, and exports inspections on mobile', async ({ page }) => {
  await page.goto('/inspections/new');
  await page.getByLabel('Make / model').fill(`Playwright Camper ${Date.now()}`);
  await page.getByLabel('Asking price').fill('42000');
  await page.getByRole('button', { name: 'Create draft' }).click();
  await expect(page.getByRole('heading', { name: /Playwright Camper/ })).toBeVisible();
  await page.getByLabel('Drivetrain').selectOption('4x4');
  await page.locator('select[name="battery_type"]').selectOption('LiFePO4');
  await page.getByRole('button', { name: 'Save inspection' }).click();
  await expect(page.getByText('Saved to the shared inspection book.')).toBeVisible();
  await page.waitForLoadState('networkidle');

  await page.goto('/inspections/new');
  await page.getByLabel('Make / model').fill(`Playwright Camper Second ${Date.now()}`);
  await page.getByLabel('Asking price').fill('52000');
  await page.getByRole('button', { name: 'Create draft' }).click();
  await expect(page.getByRole('heading', { name: /Playwright Camper Second/ })).toBeVisible();

  await page.getByRole('link', { name: 'Compare' }).click();
  await expect(page.getByRole('heading', { name: 'Compare campers' })).toBeVisible();
  const checkboxes = page.locator('input[type="checkbox"]');
  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();
  await page.getByRole('button', { name: /Compare 2 vehicles/ }).click();
  await expect(page.getByRole('columnheader', { name: /Parameter/ })).toBeVisible();

  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Export JSON' })).toHaveAttribute('href', '/api/export?format=json');
  await expect(page.getByRole('link', { name: 'Export CSV' })).toHaveAttribute('href', '/api/export?format=csv');
});

test('empty-state export responds successfully', async ({ request }) => {
  const response = await request.get('/api/export?format=json');
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).inspections).toBeDefined();
});