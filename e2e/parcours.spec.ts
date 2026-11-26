import { expect, test } from '@playwright/test';

test('une recherche mène à la fiche, avec son temps total', async ({ page }) => {
  await page.goto('/recettes');
  await page.getByPlaceholder('Rechercher une recette…').fill('alfredo');
  await page.getByRole('heading', { name: 'Chicken Alfredo Pasta' }).click();
  await expect(page).toHaveURL(/\/recettes\/\d+$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Chicken Alfredo Pasta' })).toBeVisible();
  await expect(page.getByText('Temps total :')).toContainText('35 min');
});

test('le planning est réservé aux personnes connectées', async ({ page }) => {
  await page.goto('/compte/planning');
  await expect(page).toHaveURL(/\/connexion\?retour=%2Fcompte%2Fplanning/);
  await page.getByLabel('Identifiant').fill('emilys');
  await page.getByLabel('Mot de passe').fill('emilyspass');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL('/compte/planning');
  await expect(page.getByRole('heading', { name: 'Mon compte' })).toBeVisible();
});

test('une recette avec un seul ingrédient est refusée', async ({ page }) => {
  await page.goto('/proposer');
  await page.getByLabel('Nom', { exact: true }).fill('Tarte aux pommes');
  await page.getByLabel('Préparation (min)').fill('20');
  await page.getByLabel('Ingrédient 1').fill('Pommes');
  await page.getByRole('button', { name: 'Retirer' }).last().click();
  await expect(page.getByText('Au moins deux ingrédients.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Envoyer' })).toBeDisabled();
});
