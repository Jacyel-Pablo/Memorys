import { test, expect } from '@playwright/test';

test('criar_conta.jsx', async ({ page }) => {
  await page.goto('http://localhost:5173/criar_conta');
  await expect(page.getByText('Criar contaFoto de perfil:')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Criar conta' })).toBeVisible();
  await expect(page.getByText('Foto de perfil:')).toBeVisible();
  await expect(page.locator('input[name="foto"]')).toBeVisible();
  await expect(page.getByText('Nome de usuário:')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Insira um nome de usuário:' })).toBeVisible();
  await expect(page.getByText('Email:')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Insira um email:' })).toBeVisible();
  await expect(page.getByText('Senha:')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Insira uma senha:' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enviar' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Insira um nome de usuário:' }).fill('Testando123');
  await page.getByRole('textbox', { name: 'Insira um email:' }).fill('teste@gmail.com');
  await page.getByRole('textbox', { name: 'Insira uma senha:' }).fill('123');
  await page.getByRole('button', { name: 'Enviar' }).click();
});