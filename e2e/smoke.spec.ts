import { expect, test } from '@playwright/test'

// Signed-out, read-only checks of the main pages. No data is changed.

test('landing page renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Home Bar Manager')).toBeVisible()
  await expect(page.getByText('Old Pal (1922)')).toBeVisible()
})

test('specs page lists specs from the database', async ({ page }) => {
  await page.goto('/specs')
  await expect(page.getByRole('heading', { name: 'Specs' })).toBeVisible()
  await expect(page.getByText('Classics').first()).toBeVisible()
  await expect(page.getByText('Old Pal (1922)')).toBeVisible()
})

test('spec page renders ingredients and timestamp', async ({ page }) => {
  await page.goto('/u/classics/specs/old_pal')
  await expect(page.getByText('Old Pal (1922)')).toBeVisible()
  await expect(page.getByText('3/4 oz Campari')).toBeVisible()
  await expect(page.locator('time').first()).toHaveAttribute('title', /\d{4}/)
})

test('user bar page renders inventory', async ({ page }) => {
  await page.goto('/u/test_01/bar')
  await expect(page.getByText('Bar inventory')).toBeVisible()
  await expect(page.getByText('Core Spirits').first()).toBeVisible()
})

for (const path of [
  '/u',
  '/u/test_01/create-spec',
  '/u/classics/specs/old_pal/edit',
  '/u/classics/specs/old_pal/change-user',
]) {
  test(`${path} redirects signed-out users to sign-in`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveURL(/\/sign-in$/)
  })
}

test('static data API responds', async ({ request }) => {
  const res = await request.get('/api/staticdata')
  expect(res.ok()).toBeTruthy()
})

test('user API returns only public profile fields', async ({ request }) => {
  const res = await request.get('/api/users/test_01')
  expect(res.ok()).toBeTruthy()
  const { user } = await res.json()
  expect(user.username).toBe('test_01')
  // imageUrl is omitted for users without an avatar
  const keys = Object.keys(user).filter((key) => key !== 'imageUrl')
  expect(keys.sort()).toEqual(['id', 'username'])
})

test('mutating APIs reject signed-out requests', async ({ request }) => {
  const res = await request.put('/api/stock', { data: {} })
  expect(res.status()).toBe(401)
})
