import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('redirects / to the English home page', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveURL(/\/en$/)
    await expect(page.locator('h1').first()).toHaveAttribute('aria-label', 'Hello')
  })

  test('language toggle switches the route', async ({ page }) => {
    await page.goto('http://localhost:3000/en/projects')

    await page.getByRole('button', { name: 'Auf Deutsch wechseln' }).click()

    await expect(page).toHaveURL(/\/de\/projects$/)
    await expect(page.locator('h1')).toHaveText('Alle Projekte.')
  })
})
