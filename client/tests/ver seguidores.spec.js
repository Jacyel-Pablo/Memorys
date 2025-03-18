import { test, expect } from '@playwright/test';

test('ver seguidores.jsx', async ({ page }) => {
  await page.goto('http://localhost:5173/ver_seguidores');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByText('Memorys')).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Foto de perfil', exact: true })).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'JacyelGamer204/02/' }).nth(3)).toBeVisible();
  await expect(page.getByText('Minhas redes sociais:')).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do instagram @' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do facebook @jacyel.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do x @JacyelPablo' })).toBeVisible();

  await page.getByRole('searchbox').fill('Testando123');
});