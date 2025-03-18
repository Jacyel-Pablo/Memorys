import { test, expect } from '@playwright/test';

test('perfil user.jsx', async ({ page }) => {
  await page.goto('http://localhost:5173/perfil');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByText('Memorys')).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Foto de perfil' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Foto de perfil' }).nth(1)).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Seguidores: 0$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Seguidores:' })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Seguindo: 0$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Seguindo:' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Configurações' })).toBeVisible();
  await expect(page.getByText('Minhas redes sociais:')).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do instagram @' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do facebook @jacyel.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do x @JacyelPablo' })).toBeVisible();

  await page.getByRole('searchbox').fill('Testando123');
});