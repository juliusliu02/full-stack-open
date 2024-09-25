import { useState } from 'react'

const Display = ({text}) => {
    return (
        <h1>{text}</h1>
    )
}

const Button = ({text, onClick}) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}

const Vote = ({vote}) => {
    return (
        <p>has {vote} votes</p>
    )
}

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const getRandomIndex = () => Math.floor(Math.random() * anecdotes.length)

    const [selected, setSelected] = useState(getRandomIndex)
    const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
    const handleVote = (index) => {
        const newVotes = [...votes]
        newVotes[index] += 1
        setVotes(newVotes)
    }

    // Reduce to an index
    const mostPopular = votes.reduce((prev, curr, index) => {
        if (curr > votes[prev]) {
            return index
        } else return prev
    })

    return (
        <div style={{ margin: '50px' }}>
            <Display text='Anecdote of the day' />
            {anecdotes[selected]}
            <br/>
            <Vote vote={votes[selected]}></Vote>
            <Button text='vote' onClick={() => handleVote(selected)}/>
            <Button text='next anecdote' onClick={() => setSelected(getRandomIndex)}></Button>
            <Display text='Anecdote with most votes' />
            {anecdotes[mostPopular]}
            <Vote vote={votes[mostPopular]}></Vote>
        </div>
    )
}

export default App