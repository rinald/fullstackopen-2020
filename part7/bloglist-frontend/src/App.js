import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'

import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@material-ui/core'

import './index.css'

import { useField } from './hooks'

import {
  Blog,
  BlogForm,
  Notification,
  Togglable,
  User,
  Users,
} from './components'

import {
  initializeBlogs,
  addBlog,
  showNotification,
  initializeUser,
  login,
  logout,
} from './reducers'

const App = () => {
  const dispatch = useDispatch()

  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const blogFormRef = useRef()

  const userMatch = useRouteMatch('/users/:id')
  const blogMatch = useRouteMatch('/blogs/:id')
  const userId = userMatch ? userMatch.params.id : null
  const blogId = blogMatch ? blogMatch.params.id : null

  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
  }, [dispatch])

  const handleLogin = async event => {
    event.preventDefault()

    await dispatch(login(username.value, password.value))

    resetUsername()
    resetPassword()
  }

  const handleAdd = async blog => {
    blogFormRef.current.toggleVisibility()

    await dispatch(addBlog(blog))
    dispatch(
      showNotification({
        type: 'success',
        message: `A new blog '${blog.title}' by ${blog.author} added`,
      })
    )
  }

  const handleLogout = () => dispatch(logout())

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <TextField label='username' style={{ width: '30%' }} {...username} />
      </div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <TextField label='password' style={{ width: '30%' }} {...password} />
      </div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <Button
          style={{ marginTop: '10px' }}
          variant='contained'
          color='primary'
          type='submit'
        >
          Login
        </Button>
      </div>
    </form>
  )

  return (
    <Container>
      {user === null ? (
        <div style={{ marginTop: '20px' }}>
          <Typography variant='h4'>Log in to application</Typography>
          <Notification />
          {loginForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification />
          <AppBar>
            <Toolbar>
              <IconButton
                edge='start'
                color='inherit'
                aria-label='menu'
              ></IconButton>
              <Button color='inherit' component={Link} to='/'>
                Blogs
              </Button>
              <Button color='inherit' component={Link} to='/users'>
                Users
              </Button>
              <div style={{ marginLeft: 'auto' }}>
                {user.name} logged in
                <Button color='inherit' onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route path='/users/:id'>
              <User id={userId} />
            </Route>
            <Route path='/users'>
              <Users />
            </Route>
            <Route path='/blogs/:id'>
              <Blog id={blogId} />
            </Route>
            <Route path='/'>
              <Togglable buttonLabel='create' ref={blogFormRef}>
                <BlogForm onCreate={handleAdd} />
              </Togglable>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {blogs
                      .sort((a, b) => (a.likes < b.likes ? 1 : -1))
                      .map(blog => (
                        <TableRow key={blog.id}>
                          <TableCell>
                            <Link
                              style={{ color: 'black', textDecoration: 'none' }}
                              to={`/blogs/${blog.id}`}
                            >
                              {blog.title}
                            </Link>
                          </TableCell>
                          <TableCell>{blog.user.name}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Route>
          </Switch>
        </div>
      )}
    </Container>
  )
}

export default App
