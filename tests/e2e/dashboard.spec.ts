import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should display main dashboard elements', async ({ page }) => {
    await page.goto('/');
    
    // Check if main navigation is visible
    await expect(page.locator('text=AgriSense')).toBeVisible();
    
    // Check if hero section is visible
    await expect(page.locator('text=Welcome to AgriSense')).toBeVisible();
    await expect(page.locator('text=NASA-powered insights for sustainable farming')).toBeVisible();
    
    // Check if key sections are present
    await expect(page.locator('text=Today\'s Advisory')).toBeVisible();
    await expect(page.locator('text=NASA Earth Data')).toBeVisible();
  });

  test('should navigate between different sections', async ({ page }) => {
    await page.goto('/');
    
    // Click on different navigation items
    await page.click('text=Crop Predictor');
    await expect(page.locator('text=Crop Succession Predictor')).toBeVisible();
    
    await page.click('text=Community');
    await expect(page.locator('text=Community Tips')).toBeVisible();
    
    await page.click('text=Diary');
    await expect(page.locator('text=Field Diary')).toBeVisible();
    
    // Return to dashboard
    await page.click('text=Dashboard');
    await expect(page.locator('text=Welcome to AgriSense')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile navigation is visible
    await expect(page.locator('text=AgriSense')).toBeVisible();
    
    // Check if bottom navigation is present
    await expect(page.locator('[data-testid="bottom-navigation"]')).toBeVisible();
    
    // Check if hamburger menu works
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });
});
