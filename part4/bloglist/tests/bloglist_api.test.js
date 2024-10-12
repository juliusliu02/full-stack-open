const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    await api
        .post('/api/blogs')
})

test('4.8: blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('4.9: unique identifier is called id', async () => {
    await api
        .post('/api/blogs')
        .send(helper.testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const content = response.body[0]
    assert(content.hasOwnProperty('id'))
})

test('4.10: POST creates a new post', async () => {
    const prev = await helper.getBlogs()

    await api
        .post('/api/blogs')
        .send(helper.testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await helper.getBlogs()
    console.log(response.length)
    assert.strictEqual(response.length, prev.length + 1)
})

test('4.11: likes default to zero', async () => {
    const testBlog = {
        title: 'Test post',
        author: 'Random Person',
        url: 'https://example.com'
    }

    await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await helper.getBlogs()
    const content = response[0]
    assert.strictEqual(content.likes, 0)
})

describe('delete a blog', () => {
    test('delete after adding', async () => {
        const newBlog = await api
            .post('/api/blogs')
            .send(helper.testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const prev = await helper.getBlogs()

        await api
            .delete(`/api/blogs/${newBlog.body.id}`)
            .expect(204)

        const response = await helper.getBlogs()
        console.assert(response.length, prev.length - 1)
    })
})

describe('update a blog', () => {
    test('update after adding', async () => {
        const initialResponse = await api
            .post('/api/blogs')
            .send(helper.testBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const newBlog = { ...helper.testBlog, author: 'Another one'};

        const updateResponse = await api
            .put(`/api/blogs/${initialResponse.body.id}`)
            .send(newBlog)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(initialResponse.body.id, updateResponse.body.id);
        assert.strictEqual(updateResponse.body.author, 'Another one');
    })
})

after(async () => {
    await mongoose.connection.close()
})