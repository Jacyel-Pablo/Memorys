import { test, expect } from '@playwright/test';

test('home.jsx', async ({ page }) => {
  await page.goto('http://localhost:5173/home');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByText('Memorys')).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Foto de perfil' })).toBeVisible();
  await expect(page.getByText('Minhas redes sociais:@')).toBeVisible();
  await expect(page.getByText('Minhas redes sociais:')).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do instagram @' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do facebook @jacyel.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do x @JacyelPablo' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Escreva algo:' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enviar' })).toBeVisible();
  await expect(page.locator('form div').nth(1)).toBeVisible();
  await expect(page.getByRole('textbox').nth(1)).toBeVisible();
  await expect(page.getByRole('textbox').nth(2)).toBeVisible();

  await page.getByRole('searchbox').fill('Teste123');
  await page.getByRole('navigation').getByRole('link', { name: 'Foto de perfil' }).click();
});