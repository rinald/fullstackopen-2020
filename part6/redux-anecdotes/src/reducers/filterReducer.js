const setFilter = filter => ({ type: 'SET_FILTER', filter })

const reducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter
    default:
      return state
  }
}

export { setFilter }
export default reducer
