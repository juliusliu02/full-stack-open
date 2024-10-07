const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'name must be longer than 3 characters'],
        required: true
    },
    number: {
        type: String,
        minLength: [8, 'number must be longer than 8 characters'],
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d+/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Entry', entrySchema)