import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show sign in modal when clicking sign in button', async ({ page }) => {
    await page.goto('/');
    
    // Click sign in button in desktop sidebar
    await page.click('[data-testid="sign-in-button"]');
    
    // Check if auth modal is visible
    await expect(page.locator('[data-testid="auth-modal"]')).toBeVisible();
    
    // Check if login form is shown by default
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should toggle between sign in and sign up forms', async ({ page }) => {
    await page.goto('/');
    
    // Open auth modal
    await page.click('[data-testid="sign-in-button"]');
    
    // Initially should show sign in form
    await expect(page.locator('text=Sign In')).toBeVisible();
    
    // Click to switch to sign up
    await page.click('text=Don\'t have an account? Sign up');
    
    // Should now show sign up form
    await expect(page.locator('text=Create Account')).toBeVisible();
    
    // Click to switch back to sign in
    await page.click('text=Already have an account? Sign in');
    
    // Should show sign in form again
    await expect(page.locator('text=Sign In')).toBeVisible();
  });

  test('should validate email and password fields', async ({ page }) => {
    await page.goto('/');
    
    // Open auth modal
    await page.click('[data-testid="sign-in-button"]');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('input[type="email"]')).toHaveAttribute('required');
    await expect(page.locator('input[type="password"]')).toHaveAttribute('required');
  });
});
