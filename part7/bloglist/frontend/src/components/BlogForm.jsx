import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleCreate = async (event) => {
        event.preventDefault()
        createBlog({
            title, author, url,
        })

        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={handleCreate}>
                <div>
                    title:
                    <input
                        value={title}
                        name="title"
                        id='blog-title'
                        data-testid='title'
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author:
                    <input
                        value={author}
                        name="author"
                        data-testid='author'
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url:
                    <input
                        value={url}
                        name="url"
                        data-testid='url'
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button data-testid='create' type="submit">create</button>
            </form>
        </>
    )
}

export default BlogForm