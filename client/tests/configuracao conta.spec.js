import { test, expect } from '@playwright/test';

test('configuracao conta.jsx', async ({ page }) => {
  await page.goto('http://localhost:5173/configuracao_conta');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByText('Memorys')).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Foto de perfil' })).toBeVisible();
  await expect(page.getByText('Configurações:SairEssa ação')).toBeVisible();
  await expect(page.getByText('Deleta contaApagar', { exact: true })).toBeVisible();
  await expect(page.getByText('@jacyelpablo@jacyel.lopes.5@')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Configurações:' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Foto de perfil' }).nth(1)).toBeVisible();
  await expect(page.locator('input[name="foto"]')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Trocar nome' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  await expect(page.getByText('Essa ação vai remove está')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Deleta contaApagar$/ }).getByRole('paragraph')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: /^Deleta contaApagar$/ }).locator('#deletar')).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do instagram @' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do facebook @jacyel.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'icone do x @JacyelPablo' })).toBeVisible();

  await page.getByRole('searchbox').fill('Testando123');
});