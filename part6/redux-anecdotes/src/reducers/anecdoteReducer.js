import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote: (state, action) => {
      state.push(action.payload)
    },
    voteFor: (state, action) => {
      return state.map(anecdote =>
        anecdote.id === action.payload.id ? {
            ...anecdote,
            votes: anecdote.votes + 1
        } : anecdote
      )
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(anecdote)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const upvote = anecdote => {
  return async dispatch => {
    const newAnecdote =
      await anecdoteService.update({...anecdote, votes: anecdote.votes + 1})
    dispatch(voteFor(newAnecdote))
  }
}

export const { appendAnecdote, voteFor, setAnecdotes } = anecdoteSlice.actions

export default anecdoteSlice.reducer