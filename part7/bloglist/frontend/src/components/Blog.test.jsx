import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
    id: 'testID',
    user: 'testUser',
    author: 'testAuthor',
    title: 'testTitle',
    url: 'testUrl',
    likes: 0,
}

test('renders content', () => {
    render(<Blog blog={blog} />)

    const element = screen.getByText('testTitle')
    expect(element).toBeDefined()
})

describe('<Togglable />', () => {
    let container

    beforeEach(() => {
        container = render(
            <Blog blog={blog} />
        ).container
    })

    test('renders its children', async () => {
        await screen.findAllByText('testAuthor')
    })

    test('at start the children are not displayed', () => {
        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })
})

test('5.15: like', async () => {
    const mockHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

