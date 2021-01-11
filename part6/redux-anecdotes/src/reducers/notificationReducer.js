let lastTimeoutId = null

const showNotification = (message, time) => {
  return async dispatch => {
    if (lastTimeoutId !== null) {
      clearTimeout(lastTimeoutId)
    }

    dispatch({ type: 'SHOW_NOTIFICATION', message })
    lastTimeoutId = setTimeout(() => {
      lastTimeoutId = null
      dispatch({ type: 'HIDE_NOTIFICATION' })
    }, time * 1000)
  }
}

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.message
    case 'HIDE_NOTIFICATION':
      return null
    default:
      return state
  }
}

export { showNotification }
export default reducer
