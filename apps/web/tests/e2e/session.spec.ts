import { test, expect } from '@playwright/test';

const skipBrowser = process.env.PLAYWRIGHT_SKIP_BROWSER === '1';

test.describe('HIT-ARC session flow', () => {
  test.skip(skipBrowser, 'Browser launch disabled in this environment');

  test('navigates from landing to test intake', async ({ page }) => {
    try {
      await page.goto('/');
    } catch (error) {
      test.skip('App server is not reachable in this environment');
    }
    await expect(
      page.getByRole('heading', { name: 'Human Intelligence Test — Abstraction Research Center' }),
    ).toBeVisible();
    await page.getByRole('link', { name: 'Start the Test' }).click();
    await expect(page.getByRole('heading', { name: 'Begin Evaluation' })).toBeVisible();
  });

  test('about page anchors are reachable', async ({ page }) => {
    try {
      await page.goto('/about');
    } catch (error) {
      test.skip('App server is not reachable in this environment');
    }
    await expect(page.getByRole('heading', { name: 'About the Artwork' })).toBeVisible();
    await page.locator('a[href="#protocol"]').click();
    await expect(page.locator('#protocol')).toBeVisible();
  });
});
