import Togglable from './Togglable.jsx'
import { useState } from 'react'

const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const like = () => {
        const newBlog = {
            id: blog.id,
            user: blog.user,
            author: blog.author,
            title: blog.title,
            url: blog.url,
            likes: blog.likes + 1,
        }
        updateBlog(newBlog)
    }

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deleteBlog(blog)
        }
    }

    return (
        <div className='blog' style={blogStyle}>
            <div>
                {blog.title}
                <Togglable buttonLabel='view'>
                    <p>{blog.url}</p>
                    <p>
                        {'likes ' + blog.likes}
                        <button onClick={like}>like</button>
                    </p>
                    <p>{blog.author}</p>
                    {user === blog.user.username ?
                        <button onClick={handleDelete}>remove</button> : null
                    }
                </Togglable>
            </div>
        </div>
    )}

export default Blog