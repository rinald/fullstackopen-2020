let lastTimeoutId = null

const showNotification = (notificaton, time = 5) => {
  return async dispatch => {
    if (lastTimeoutId !== null) {
      clearTimeout(lastTimeoutId)
    }

    dispatch({ type: 'SHOW_NOTIFICATION', notificaton })
    lastTimeoutId = setTimeout(() => {
      lastTimeoutId = null
      dispatch({ type: 'HIDE_NOTIFICATION' })
    }, time * 1000)
  }
}

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return action.notificaton
    case 'HIDE_NOTIFICATION':
      return null
    default:
      return state
  }
}

export { showNotification }
export default reducer
