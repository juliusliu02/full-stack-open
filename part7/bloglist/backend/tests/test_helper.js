const Blog = require('../models/blog');
const User = require('../models/user');

const testBlog = {
    title: 'Test post',
    author: 'Random Person',
    url: 'https://example.com',
    likes: 3
}

const testUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
}

const getBlogs = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const getUsers = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { testBlog, testUser, getBlogs, getUsers }