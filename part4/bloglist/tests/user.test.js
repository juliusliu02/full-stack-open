const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')

const app = require('../app')
const {testBlog} = require("./test_helper");
const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.getUsers()

        await api
            .post('/api/users')
            .send(helper.testUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.getUsers()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
})

describe('input validation', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })

    test('creation fails when username is shorter than 3 characters', async () => {
        const newUser = { ...helper.testUser, username: 'ml' }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
    })

    test('creation fails with a duplicated username', async () => {
        await api
            .post('/api/users')
            .send(helper.testUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const result = await api
            .post('/api/users')
            .send(helper.testUser)
            .expect(400)

        assert(result.body.error.includes('expected `username` to be unique'))
    })
})

describe('test blog creation with link to user', () => {
    let token

    beforeEach(async () => {
        await User.deleteMany({})
        await api
            .post('/api/users')
            .send(helper.testUser)
            .expect(201)

        const auth = await api
            .post('/api/login')
            .send(helper.testUser)
            .expect(200)

        token = auth.body.token
    })

    test('created blogs include user id', async () => {
        const result = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog)
            .expect(201)
        assert(Object.hasOwn(result.body, 'user'))

        await api
            .get('/api/blogs')
            .expect(200)
    })

    test('4.23 unauthorized creation is blocked', async () => {
        await api
            .post('/api/blogs')
            .send(testBlog)
            .expect(401)
    })
})

after(async () => {
    await mongoose.connection.close()
})