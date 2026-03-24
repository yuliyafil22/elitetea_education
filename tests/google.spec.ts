import { test, expect } from '@playwright/test';

test.describe('Google homepage', () => {
  test('should show the Google text/logo', async ({ page }) => {
    await page.goto('https://www.google.com/ncr', { waitUntil: 'domcontentloaded' });

    // Consent dialogs vary by region/language.
    const consentCandidates = [
      /Accept all/i,
      /I agree/i,
      /Accept everything/i,
      /Agree/i,
      /Tout accepter/i,
      /Alle akzeptieren/i,
      /Aceptar todo/i,
      /Принять все/i,
    ];

    for (const re of consentCandidates) {
      const btn = page.getByRole('button', { name: re }).first();
      try {
        if (await btn.isVisible({ timeout: 2500 })) {
          await btn.click();
          break;
        }
      } catch {
        // ignore
      }
    }

    const googleLogo = page.getByRole('img', { name: /Google/i }).first();
    await expect(googleLogo).toBeVisible();
  });
});
