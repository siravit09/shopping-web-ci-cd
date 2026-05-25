import { test, expect } from '@playwright/test';

test('Login Pass', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  await expect(page).toHaveTitle(/Simple Shop/);

  await page.locator('input[name="username"]').fill('demo');
  await expect(page.locator('input[name="username"]')).toHaveValue('demo');
  await page.locator('input[name="password"]').fill('password123');
  await expect(page.locator('input[name="password"]')).toHaveValue('password123');
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('#logout-button')).toBeVisible();
});