import { test, expect } from '@playwright/test';

test('ativar__conta.jsx', async ({ page }) => {
  await page.goto('http://localhost:5173/ativar__conta');
  await expect(page.getByText('Ocorreu um erro ao ativar sua')).toBeVisible();
});