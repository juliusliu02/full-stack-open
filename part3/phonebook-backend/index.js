require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/phonebook')

morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny', {
    skip: function (req) { return req.method === 'POST' }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content', { skip: function (req) { return req.method !== 'POST' } } ))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    Entry.find({}).countDocuments().then(count => {
        const res = `Phonebook has info for ${count} people<br/>${new Date().toString()}`
        response.send(res)
    })
})

app.get('/api/persons', (request, response, next) => {
    Entry.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Entry.findById(request.params.id)
        .then(entry => {
            response.json(entry)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    console.log(request.body)
    Entry.findOneAndUpdate(
        { name }, { number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(res => {
            console.log(res)
            response.json(res)
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Entry.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body

    if (!name || !number) {
        response.status(400).json({
            error: 'field missing'
        })
        return
    }

    const person = new Entry({ name: name, number: number })

    person.save()
        .then(res => response.json(res))
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})