import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = async () => {
    const request = await axios.get(baseUrl)
    return request.data
}

const create = async newBlog => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
}

const update = async blog => {
    // user is an object.
    const response = await axios.put(baseUrl + '/' + blog.id, { ...blog, user: blog.user.id })
    return response.data
}

const deleteBlog = async blog => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.delete(baseUrl + '/' + blog.id, config)
    return response.data
}

export default { getAll, create, update, deleteBlog, setToken }