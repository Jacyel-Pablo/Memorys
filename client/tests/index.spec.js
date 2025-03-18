import { test, expect } from '@playwright/test';

test('index.jsx', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await expect(page.getByText('LoginEmail:Senha:Esqueceu sua')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByText('Email:')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Insira um email:' })).toBeVisible();
  await expect(page.getByText('Senha:')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Insira uma senha:' })).toBeVisible();
  await expect(page.getByText('Esqueceu sua senha')).toBeVisible();
  await expect(page.getByRole('link', { name: 'senha' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Criar conta' })).toBeVisible();

  await page.getByRole('textbox', { name: 'Insira um email:' }).fill('teste@gmail.com');
  await page.getByRole('textbox', { name: 'Insira uma senha:' }).fill('123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.getByRole('button', { name: 'Criar conta' }).click();
});