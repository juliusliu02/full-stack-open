const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs).end()
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const blog = new Blog(request.body)
    const user = await User.findById(request.user)
    if (!user) {
        return response.status(401).json({ error: 'token invalid' })
    }
    blog.user = user.id

    if (!blog.likes) {
        blog.likes = 0
    }

    const savedNote = await (await blog.save()).populate('user')
    response.status(201).json(savedNote).end()
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    if (!request.user) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(request.user)
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(204).end()
    }

    const blogOwner = await User.findById(blog.user)
    if ( user.toString() !== blogOwner.toString() ) {
        return response.status(401).json({ error: 'unauthorized' })
    }
    await Blog.findByIdAndDelete(request.params.id)        
    response.status(204).end()                             
})

blogRouter.put('/:id', async (request, response) => {

    const newBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { ...request.body },
        { new: true }).populate('user')

    response.json(newBlog).end()
})

module.exports = blogRouter