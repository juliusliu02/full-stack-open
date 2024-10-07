const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://phonebook:${password}@cluster0.pvlev.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Entry = mongoose.model('Entry', phoneSchema)

if (!name || !number) {
    Entry
        .find({})
        .then(persons => {
            console.log('phonebook:')
            persons.map(person => {
                console.log(person.name + ' ' + person.number)
            })
            mongoose.connection.close()
        })
    return
}

const entry = new Entry({
    name: name,
    number: number,
})

entry.save().then(() => {
    console.log(`added ${name} ${number} to phonebook!`)
    mongoose.connection.close()
})