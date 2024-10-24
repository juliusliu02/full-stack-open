import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    showNotification: (state, action) => {
      return action.payload
    },
    removeNotification: (state, action) => {
      return ''
    }
  }
})

export const setNotification = notification => {
  return async dispatch => {
    dispatch(showNotification(`You created a new anecdote: "${notification}."`))
    setTimeout(() => dispatch(removeNotification()), 5000)
  }
}

export const { showNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;