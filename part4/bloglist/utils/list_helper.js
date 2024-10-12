// Load the full build.
var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (acc, blog) => {
        if (acc.likes < blog.likes) {
            return blog
        } else {
            return acc
        }
    }
    return blogs.length === 0 ? {} : blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    const result =
        _(blogs)
            .countBy(blog => blog.author)
            .toPairs()
            .sortBy(1)
            .reverse()
            .value()[0]

    return {
        'author': result[0],
        'blogs': result[1],
    }
}

const mostLikes = (blogs) => {
    let result =
        _(blogs)
            .groupBy(blog => blog.author)
            .mapValues(list => _.sumBy(list, 'likes'))
            .toPairs()
            .sortBy(1)
            .reverse()
            .value()[0]

    return {
        'author': result[0],
        'likes': result[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}