const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

// Run with Metro at AUTH_PREVIEW_URL (defaults to port 8082).
(async () => {
  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 880 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.goto(process.env.AUTH_PREVIEW_URL || 'http://localhost:8082', { waitUntil: 'networkidle', timeout: 120000 });
  await page.getByRole('button', { name: 'Continue with Google', exact: true }).waitFor({ timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const output = 'design/qa';
  fs.mkdirSync(output, { recursive: true });
  await page.screenshot({ path: path.join(output, `auth-${process.env.CAPTURE_NAME || 'final'}.png`) });

  for (const provider of ['Google', 'Apple']) {
    const button = page.getByRole('button', { name: `Continue with ${provider}`, exact: true });
    await expect(button).toHaveCSS('flex-direction', 'row');
    await expect(button).toHaveCSS('background-color', provider === 'Apple' ? 'rgb(32, 33, 36)' : 'rgb(255, 255, 255)');
    await page.getByRole('button', { name: `Continue with ${provider}`, exact: true }).click();
    await expect(page.getByRole('heading', { name: `${provider} sign-in isn't available yet` })).toBeVisible();
    await page.getByRole('button', { name: 'Got it' }).click();
    await expect(page.getByRole('button', { name: 'Got it' })).toHaveCount(0);
  }
  for (const title of ['Terms of Service', 'Privacy Policy']) {
    await page.getByRole('link', { name: title, exact: title !== 'Privacy Policy' }).click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Got it' }).click();
    await expect(page.getByRole('button', { name: 'Got it' })).toHaveCount(0);
  }
  // RN Modal's exit animation can outlive its accessibility subtree.
  await page.waitForTimeout(400);
  for (const viewport of [{ width: 414, height: 736 }, { width: 320, height: 568 }, { width: 393, height: 700 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    if (viewport.width === 414) await page.screenshot({ path: path.join(output, 'auth-414x736-top.png') });
    await page.getByRole('button', { name: 'Continue with Apple', exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: 'Continue with Apple', exact: true })).toBeInViewport();
    await page.getByRole('link', { name: 'Privacy Policy.' }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: 'Privacy Policy.' })).toBeInViewport();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    await page.screenshot({ path: path.join(output, `auth-${viewport.width}x${viewport.height}.png`) });
  }
  expect(errors).toEqual([]);
  console.log(JSON.stringify({ errors, interactions: 'Google, Apple, Terms, Privacy, dismiss', responsive: '414x736, 320x568, 393x700, 768x1024: passed; web only' }));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
