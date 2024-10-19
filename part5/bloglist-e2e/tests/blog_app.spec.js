const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('login-form')).toBeVisible();
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await helper.loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('blogs')).toBeVisible();
    })

    test('fails with wrong credentials', async ({ page }) => {
      await helper.loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('Wrong credentials')).toBeVisible();
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await helper.loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await helper.createBlog(page, 'testTitle', 'testAuthor', 'testUrl')

      const blog = await page.locator('.blog')
      await expect(blog).toContainText('testTitle')
    })

    test('like can be clicked', async ({ page }) => {
      await helper.createBlog(page, 'testTitle', 'testAuthor', 'testUrl')

      const blog = await page.locator('.blog')
      await blog.getByRole('button').click()

      await expect(blog.getByText('likes 0')).toBeVisible()
      await blog.getByText('like').click()
      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('user can delete a blog', async ({ page }) => {
      await helper.createBlog(page, 'testTitle', 'testAuthor', 'testUrl')
      page.on('dialog', async dialog => await dialog.accept())

      const blog = await page.locator('.blog')
      await blog.getByRole('button').click()
      await blog.getByText('remove').click()

      const message = await page.getByText('Blog is successfully deleted.')
      await expect(message).toBeVisible()
      await expect(page.getByText('testTitle')).not.toBeVisible()
    })

    test('blogs are soreted by likes' , async ({ page }) => {
      await helper.createBlog(page, 'title1', 'testAuthor', 'testUrl')
      await helper.createBlog(page, 'title2', 'testAuthor', 'testUrl')

      const blog1 = await page.locator('.blog').filter({ hasText: 'title1' })
      const blog2 = await page.locator('.blog').filter({ hasText: 'title2' })
      await blog1.waitFor()
      await blog2.waitFor()

      await blog1.getByRole('button').click()
      await blog1.getByText('like').click()
      await expect(page.locator('.blog').first()).toContainText('title1')

      await blog2.getByRole('button').click()
      await blog2.getByText('like').click()
      await blog2.getByText('like').click()
      await expect(page.locator('.blog').first()).toContainText('title2')
    })
  })

  describe('With two users', async () => {
    beforeEach(async ({ request }) => {
      await request.post('http://localhost:3001/api/users', {
        data: {
          name: 'Root',
          username: 'root',
          password: 'sekret'
        }
      })
    })

    test('delete is only shown to owner', async ({ page }) => {
      await page.goto('http://localhost:5173')
      await helper.loginWith(page, 'root', 'sekret')
      await helper.createBlog(page, 'testTitle', 'testAuthor', 'testUrl')

      // Creator can see delete button
      const blog = await page.locator('.blog')
      await blog.getByRole('button').click()
      await expect(blog.getByText('remove')).toBeVisible()
      await page.getByText('log out').click()

      // Other user can't see delete button
      await helper.loginWith(page, 'mluukkai', 'salainen')
      const blog2 = await page.locator('.blog')
      await blog2.getByRole('button').click()
      await expect(blog2.getByText('remove')).not.toBeVisible()
    })
  })
})
