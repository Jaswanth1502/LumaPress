import { test, expect } from '@playwright/test';

test.describe('LumaPress End-to-End User Flow', () => {
  const timestamp = Date.now();
  const testUser = {
    name: `E2E Author ${timestamp}`,
    email: `e2e_${timestamp}@example.com`,
    password: 'Password123!',
  };

  test('Complete End-to-End Journey: Register -> Write Article -> Publish -> Comment -> Delete', async ({ page }) => {
    // 1. Visit Home Page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Stories & Insights');

    // 2. Navigate to Register Page
    await page.click('text=Get Started');
    await expect(page).toHaveURL('/register');

    // 3. Register New Account
    await page.fill('input[placeholder="John Doe"]', testUser.name);
    await page.fill('input[placeholder="author@example.com"]', testUser.email);
    await page.locator('input[placeholder="••••••••"]').first().fill(testUser.password);
    await page.locator('input[placeholder="••••••••"]').last().fill(testUser.password);

    await page.click('button[type="submit"]');

    // 4. Verify Redirection to Dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText(`Welcome back, ${testUser.name}`);

    // 5. Create New Post
    await page.click('text=Create New Post');
    await expect(page).toHaveURL('/posts/create');

    const postTitle = `E2E Article Title ${timestamp}`;
    await page.fill('input[placeholder*="Design Systems"]', postTitle);
    await page.fill('textarea[placeholder*="brief 1-2 sentence"]', 'An automated end-to-end test article summary.');
    await page.fill('textarea[placeholder*="Write your article content"]', '# Automated Article\n\nThis is an e2e content body.');

    // Add Tag
    await page.fill('input[placeholder*="Add a tag"]', 'Automation');
    await page.click('button:has-text("Add")');

    // Publish Article
    await page.click('button:has-text("Publish Article")');

    // 6. Verify Redirected to Post Detail Page
    await expect(page.locator('h1')).toContainText(postTitle);
    await expect(page.locator('text=#Automation')).toBeVisible();

    // 7. Add Comment
    await page.fill('textarea[placeholder*="Share your thoughts"]', 'This is an end-to-end test comment!');
    await page.click('button:has-text("Post Comment")');

    // Verify Comment Appears
    await expect(page.locator('text=This is an end-to-end test comment!')).toBeVisible();

    // 8. Delete Article
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Delete Permanently")');

    // Verify Redirect back to Dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
