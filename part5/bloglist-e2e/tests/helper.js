const loginWith = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click();
}

const createBlog = async (page, title, author, url) => {
    await page.getByText('new blog').click();
    await page.getByTestId('title').fill(title);
    await page.getByTestId('author').fill(author);
    await page.getByTestId('url').fill(url);
    await page.getByTestId('create').click();
}

export { loginWith, createBlog }