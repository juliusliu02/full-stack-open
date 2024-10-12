const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('test total likes of empty list', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })
})

describe('favorite blog', () => {
    const emptyList = []

    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    const listWithTwoBlogs = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Test',
            author: 'Test',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 8,
            __v: 0
        }
    ]

    test('empty list, empty object', () => {
        const result = listHelper.favoriteBlog(emptyList)
        assert.deepStrictEqual(result, {})
    })

    const t1 = {
        _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    }

    test('when list has only one blog, equals that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, t1)
    })

    const t2 = {
        _id: '5a422aa71b54a676234d17f9',
            title: 'Test',
        author: 'Test',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 8,
        __v: 0
    }

    test('when list has two blog, equals the most liked blog', () => {
        const result = listHelper.favoriteBlog(listWithTwoBlogs)
        assert.deepStrictEqual(result, t2)
    })
})


describe('mostBlogs', () => {
    const list = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Test',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 8,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Random Person',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
    ]

    test('mostBlog test with two authors', () => {
        const result = listHelper.mostBlogs(list)
        assert.deepStrictEqual(result, {
            'author': 'Edsger W. Dijkstra',
            'blogs': 2
        })
    })
})

describe('mostLikes', () => {
    const list = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Test',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 8,
            __v: 0
        },
        {
            _id: '5a422aa71b54a676234d17f9',
            title: 'Test',
            author: 'Random Person',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 15,
            __v: 0
        }
    ]

    test('mostLikes test with two authors', () => {
        const result = listHelper.mostLikes(list)
        assert.deepStrictEqual(result, {
            author: 'Random Person',
            likes: 15
        })
    })
})