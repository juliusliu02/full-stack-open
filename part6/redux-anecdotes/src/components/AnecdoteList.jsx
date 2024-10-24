import { useDispatch, useSelector } from 'react-redux'
import { upvote } from '../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer.js";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div key={anecdote.id}>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes =
    useSelector(state => {
      return state.anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
        .sort((a, b) => a.votes - b.votes)
        .reverse()
    })

  const vote = (anecdote) => {
    dispatch(upvote(anecdote))
    dispatch(setNotification(`You voted "${anecdote.content}"`))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <Anecdote
        key={anecdote.id}
        anecdote={anecdote}
        handleClick={() => vote(anecdote)}
        />
      )}
    </>
  )
}

export default AnecdoteList