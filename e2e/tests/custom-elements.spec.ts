import { test, expect } from '@playwright/test';

test('has initial text from first api response', async ({ page }) => {
  await page.goto('http://localhost:8080');

  await expect(page.locator("#custom-elements")).toHaveText("Helle from the API!")
});