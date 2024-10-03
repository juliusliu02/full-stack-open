import { useState, useEffect } from 'react'
import personsServices from './services/persons.js'

const Filter = ({ handleChange }) => {
    return (
        <>
            filter shown with <input onChange={handleChange} />
        </>
    )
}

const Phonebook = ({persons, handleDelete}) => {
    return (
        <>
            {persons.map((person) => {
                return <>
                    <p key={person.id}>{person.name} {person.number}</p>
                    <button key={'d'+person.id} onClick={() => handleDelete(person)}>delete</button>
                </>
            })}
        </>
    )
}

const Notification = ({message}) => {
    if (message === null) return null

    const success = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    const error = {
        color: 'red',
        fontStyle: 'italic',
        fontSize: 16
    }

    if (message.type === 'success') {
        return (
            <div style={success}>
                {message.body}
            </div>
        )
    }

    if (message.type === 'error') {
        return (
            <div style={error}>
                {message.body}
            </div>
        )
    }
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newSearch, setNewSearch] = useState('')
    const [message, setMessage] = useState({})

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleSearchChange = (event) => {
        setNewSearch(event.target.value)
    }

    const addName = (event) => {
        event.preventDefault()
        const newPerson = {name: newName, number: newNumber}
        const prevPerson = findName(newName)

        if (prevPerson !== undefined) {
            window.confirm(newName + ' is already added to phonebook. Replace the old number with the new one?')
            personsServices.update(prevPerson.id, newPerson)
                .catch(error => {
                    setMessage({type: 'error', body: `${newName}'s information has already been removed from server.`})
                })
            setPersons(persons.map(person => (person.name === newName ? newPerson : person)))
            setMessage({type: 'success', body: `${newName} updated successfully.`})
            return
        }

        personsServices.create(newPerson)
            .then(res => {
                newPerson.id = res.id
                setPersons(persons.concat(newPerson))
                setMessage({type: 'success', body: `${newName} added successfully.`})
            }).catch(error => {
                setMessage({type: 'error', body: error.message})
        })
    }

    const findName = (name) => {
        return persons.find(person => person.name === name)
    }

    const filterNames = (query) => {
        return persons.filter(person => person.name.toLowerCase().includes(query.toLowerCase()))
    }

    const handleDelete = (person) => {
        window.confirm('Are you sure you want to delete ' + person.name + '?')
        personsServices.deletePerson(person.id)
            .then(res => {
                console.log(res)
                const newPersons = persons.filter(p => p.id !== person.id)
                setPersons(newPersons)
                setMessage({type: 'success', body: `${person.name} deleted successfully.`})
            }).catch(error => {
            setMessage({type: 'error', body: error.message})
        })
    }

    useEffect(() => {
        personsServices.getAll()
            .then(res => setPersons(res))
            .catch(error => {
                setMessage({type: 'error', body: error.message})
            })
    }, [])

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message}></Notification>
            <Filter handleChange={handleSearchChange}></Filter>

            <h3>Add a new</h3>
            <form onSubmit={addName}>
                <div>
                    name: <input onChange={handleNameChange}/>
                    <br/>
                    number: <input onChange={handleNumberChange}/>
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
            <h3>Numbers</h3>
            <Phonebook persons={newSearch === '' ? persons : filterNames(newSearch)} handleDelete={handleDelete}/>
        </div>
    )
}

export default App