import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('renders homepage with correct header, hero, and stat rail', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Build the systems')

    // Check achievement stats
    const proofFacts = page.locator('.aries-home-leap-proof__facts')
    await expect(proofFacts).toContainText('#01')

    // Check nav links
    await expect(page.getByRole('link', { name: 'Mission' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'LEAP-One' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'News' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Gallery' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact' }).first()).toBeVisible()
  })

  test('can navigate to LEAP-One page', async ({ page }) => {
    await page.goto('http://localhost:3000/leap-one')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('LEAP')
    await expect(page.locator('.hero')).toBeVisible()
  })

  test('can navigate to About page', async ({ page }) => {
    await page.goto('http://localhost:3000/about')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Twenty-five minds.')
    await expect(heading).toContainText('A growing program.')
    await expect(page.locator('.department-grid')).toBeVisible()
  })

  test('can navigate to Team page and view the organization hierarchy', async ({ page }) => {
    await page.goto('http://localhost:3000/team')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('HSM Aries has')
    await expect(heading).toContainText('no passengers.')
    await expect(page.locator('.principal-advisors')).toBeVisible()
    await expect(page.locator('.mentor-council')).toBeVisible()
    await expect(page.locator('.department-manifest').first()).toBeVisible()
  })

  test('can navigate to News page and view stories', async ({ page }) => {
    await page.goto('http://localhost:3000/news')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Mission')
    await expect(page.locator('.news-grid')).toBeVisible()
  })

  test('can navigate to Gallery page', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Tested in the field.')
    await expect(page.locator('.gallery-rail')).toBeVisible()
  })

  test('can navigate to Contact page', async ({ page }) => {
    await page.goto('http://localhost:3000/contact')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Start with a')
    await expect(page.locator('form.contact-form')).toBeVisible()
  })

  test('can navigate to branded login page', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Welcome back.')
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
  })

  test('can open news story and click Evidence Locker image to expand in modal', async ({ page }) => {
    await page.goto('http://localhost:3000/news/hardware-milestone-hsm-aries-space-successfully-assembles-latest-high-performance-flight-unit')
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()

    // Click on the first Evidence Locker image
    const deckButton = page.locator('.mission-story__deck-asset').first()
    await expect(deckButton).toBeVisible()
    await deckButton.click()

    // Verify modal is open
    const modal = page.locator('.mission-story__modal')
    await expect(modal).toBeVisible()
    await expect(page.locator('.mission-story__modal-counter')).toContainText('ASSET')

    // Close modal
    const closeBtn = page.locator('.mission-story__modal-close')
    await closeBtn.click()
    await expect(modal).not.toBeVisible()
  })
})
