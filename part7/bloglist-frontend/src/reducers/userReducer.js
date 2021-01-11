import blogService from '../services/blogs'
import loginService from '../services/login'
import { showNotification } from '../reducers/notificationReducer'

const initializeUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({ type: 'INIT_USER', data: user })
    } else {
      dispatch({ type: 'INIT_USER', data: null })
    }
  }
}

const login = (username, password) => {
  return async dispatch => {
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      blogService.setToken(user.token)
      dispatch({ type: 'LOGIN', data: user })
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILED' })
      dispatch(showNotification({ type: 'error', message: 'Login failed' }))
    }
  }
}

const logout = () => {
  window.localStorage.removeItem('loggedUser')
  return { type: 'LOGOUT', data: null }
}

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'INIT_USER':
      return action.data
    case 'LOGIN':
      return action.data
    case 'LOGOUT':
    case 'LOGIN_FAILED':
      return null
    default:
      return state
  }
}

export { initializeUser, login, logout }
export default reducer
