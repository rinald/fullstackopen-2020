import React, { useState, useEffect, useRef } from 'react'
import './index.css'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setUsername('')
      setPassword('')
      setStatus({
        message: 'Wrong username or password',
        outcome: 'error',
      })
      setTimeout(() => {
        setStatus(null)
      }, 5000)
    }
  }

  const handleAdd = async blog => {
    blogFormRef.current.toggleVisibility()
    const newBlog = await blogService.create(blog)

    setBlogs([...blogs, newBlog])
    setStatus({
      message: `A new blog '${blog.title}' by ${blog.author} added`,
      outcome: 'success',
    })
    setTimeout(() => {
      setStatus(null)
    }, 5000)
  }

  const handleLikes = async blog => {
    blog.likes += 1

    await blogService.update(blog)
    const updatedBlogIndex = blogs.findIndex(_blog => _blog.id === blog.id)

    const updatedBlogs = blogs
    updatedBlogs[updatedBlogIndex] = blog

    setBlogs(updatedBlogs)
    setStatus({
      message: `You just liked ${blog.user.username}'s blog post`,
      outcome: 'success',
    })
    setTimeout(() => {
      setStatus(null)
    }, 5000)
  }

  const handleRemove = async blog => {
    const removeConfirmed = window.confirm(
      `Do you want to remove the blog '${blog.title}'`
    )

    try {
      if (removeConfirmed) {
        await blogService.remove(blog)

        setBlogs(blogs.filter(_blog => _blog.id !== blog.id))
        setStatus({
          message: 'Blog removed successfully',
          outcome: 'success',
        })
        setTimeout(() => {
          setStatus(null)
        }, 5000)
      }
    } catch (error) {
      setStatus({
        message: 'Only the original creator can remove the blog',
        outcome: 'error',
      })
      setTimeout(() => {
        setStatus(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          id='username'
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          id='password'
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit' id='loginButton'>
        login
      </button>
    </form>
  )

  return (
    <div>
      {user === null ? (
        <>
          <h2>log in to application</h2>
          <Notification status={status} />
          {loginForm()}
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <Notification status={status} />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='create' ref={blogFormRef}>
            <BlogForm onCreate={handleAdd} />
          </Togglable>
          <br />
          {blogs
            .sort((a, b) => (a.likes < b.likes ? 1 : -1))
            .map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                onLike={handleLikes}
                onRemove={handleRemove}
              />
            ))}
        </>
      )}
    </div>
  )
}

export default App
