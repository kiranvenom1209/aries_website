import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('renders homepage with correct header, hero, and stat rail', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Build the systems')

    // Check achievement stats
    const proofFacts = page.locator('.aries-home-leap-proof__facts').first()
    await expect(proofFacts).toContainText('17/124')

    // Check nav links
    await expect(page.getByRole('link', { name: 'Mission' }).first()).toBeVisible()
    await expect(page.locator('.site-footer').getByRole('link', { name: 'LEAP-One' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'News' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Gallery' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact' }).first()).toBeVisible()
  })

  test('homepage footer status shows the ERC 2026 result and the next rover', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const status = page.locator('.site-footer__status')
    await expect(status).toContainText('Leap-2')
    await expect(status).toContainText('17th place')
  })

  test('can navigate to LEAP-One page', async ({ page }) => {
    await page.goto('http://localhost:3000/leap-one')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('LEAP')
    await expect(page.locator('.project-hero')).toBeVisible()
  })

  test('Leap Rovers nav item reveals LEAP-One and Leap-2 on hover', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const group = page.locator('.site-nav__group')
    await group.getByRole('link', { name: 'Leap Rovers' }).hover()
    const menu = group.locator('.site-nav__menu')
    await expect(menu.getByRole('link', { name: 'LEAP-One' })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Leap-2' })).toBeVisible()
    await menu.getByRole('link', { name: 'Leap-2' }).click()
    await expect(page).toHaveURL(/\/leap-2$/)
  })

  test('can navigate to Leap-2 page', async ({ page }) => {
    await page.goto('http://localhost:3000/leap-2')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Leap-2')
    await expect(page.locator('#concept')).toBeVisible()
    await expect(page.locator('.project-priorities > li')).toHaveCount(4)
  })

  test('can navigate to About page', async ({ page }) => {
    await page.goto('http://localhost:3000/about')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('Built by students')
    await expect(heading).toContainText('Proven in Kraków')
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
    await expect(page.locator('.gallery-rail').first()).toBeVisible()
  })

  test('gallery rail counter includes the ERC 2026 finals photo set', async ({ page }) => {
    await page.goto('http://localhost:3000/gallery')
    const counter = page.locator('.gallery-chapters__count').first()
    await expect(counter).toHaveText(/\d+ frames/)
    const match = (await counter.textContent())?.match(/(\d+) frames/)
    expect(match).toBeTruthy()
    expect(Number(match?.[1])).toBeGreaterThanOrEqual(39)
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
    await expect(page.locator('.mission-story__modal-counter')).toContainText(/Photo \d+ of \d+/)

    // Close modal
    const closeBtn = page.locator('.mission-story__modal-close')
    await closeBtn.click()
    await expect(modal).not.toBeVisible()
  })

  test('can open the ERC 2026 finals story and expand its Evidence Locker in a modal', async ({ page }) => {
    await page.goto('http://localhost:3000/news/mission-complete-hsm-aries-space-finishes-17th-of-25-at-the-erc-2026-finals-in-krakow')
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('17th place')

    // Click on the first Evidence Locker image
    const deckButton = page.locator('.mission-story__deck-asset').first()
    await expect(deckButton).toBeVisible()
    await deckButton.click()

    // Verify modal is open
    const modal = page.locator('.mission-story__modal')
    await expect(modal).toBeVisible()
    await expect(page.locator('.mission-story__modal-counter')).toContainText(/Photo \d+ of \d+/)

    // Close modal
    const closeBtn = page.locator('.mission-story__modal-close')
    await closeBtn.click()
    await expect(modal).not.toBeVisible()
  })
})
