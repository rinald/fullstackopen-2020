import anecdoteService from '../services/anecdotes'

const voteAnecdote = id => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.vote(id)

    dispatch({
      type: 'VOTE',
      data: updatedAnecdote,
    })
  }
}

const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}

const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_ANECDOTES':
      return action.data
    case 'VOTE':
      const { id } = action.data
      const index = state.findIndex(anecdote => anecdote.id === id)
      const newState = [...state]
      newState[index].votes += 1
      return newState
    case 'NEW_ANECDOTE':
      return [...state, action.data]
    default:
      return state
  }
}

export { voteAnecdote, createAnecdote, initializeAnecdotes }
export default reducer
