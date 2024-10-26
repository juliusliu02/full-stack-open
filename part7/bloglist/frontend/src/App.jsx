import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => {
    if (message === null) return null

    const success = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    const error = {
        color: 'red',
        fontStyle: 'italic',
        fontSize: 16
    }

    if (message.type === 'success') {
        return (
            <div style={success}>
                {message.body}
            </div>
        )
    }

    if (message.type === 'error') {
        return (
            <div style={error}>
                {message.body}
            </div>
        )
    }
}

const Login = ({ handleLogin, username, setUsername, password, setPassword, message }) => {
    return (
        <>
            <h1>log in to application</h1>
            <form data-testid='login-form' onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        data-testid='username'
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        data-testid='password'
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
            <Notification message={message} />
        </>
    )
}

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState({})

    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    const showErrorMessage = (message) => {
        setMessage({ type: 'error', body: message })
        setTimeout(() => {
            setMessage({})
        }, 5000)
    }

    const showSuccessMessage = (message) => {
        setMessage({ type: 'success', body: message })
        setTimeout(() => {
            setMessage({})
        }, 5000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })
            setUser(user)
            setUsername('')
            setPassword('')
            blogService.setToken(user.token)
            window.localStorage.setItem(
                'currentUser', JSON.stringify(user)
            )
        } catch (exception) {
            showErrorMessage('Wrong credentials')
        }
    }

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('currentUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    if (user === null) {
        return (
            <Login handleLogin={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                message={message}
            />
        )
    }

    const logOut = () => {
        window.localStorage.clear()
        setUser(null)
    }

    const createBlog = async (blog) => {
        try {
            const response = await blogService.create(blog)
            setBlogs(blogs.concat(response))
            showSuccessMessage(`A new blog ${blog.title} by ${blog.author} added.`)
            blogFormRef.current.toggleVisibility()
        } catch (exception) {
            showErrorMessage('Creation failed: ' + exception.message)
        }
    }

    const updateBlog = async (blog) => {
        const response = await blogService.update(blog)
        setBlogs(blogs.map((blog) => blog.id === response.id? response : blog))
    }

    const deleteBlog = async (blogToDelete) => {
        try {
            await blogService.deleteBlog(blogToDelete)
            setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id))
            showSuccessMessage('Blog is successfully deleted.')
        } catch (exception) {
            showErrorMessage('Error: ' + exception.message)
        }
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification message={message} />
            <p>{(user.name || user.username) + ' logged in'}</p>
            <button onClick={logOut}>log out</button>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm createBlog={createBlog} />
            </Togglable>
            {blogs
                .sort((a, b) => a.likes - b.likes)
                .reverse()
                .map(blog =>
                    <Blog
                        key={blog.id}
                        blog={blog}
                        updateBlog={updateBlog}
                        user={user.username}
                        deleteBlog={deleteBlog}
                    />
                )
            }
        </div>
    )
}

export default App