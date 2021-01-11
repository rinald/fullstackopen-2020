const blogsRouter = require('express').Router()

const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id).populate('user', {
    username: 1,
    name: 1,
  })

  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({ ...request.body, user: user._id, comments: [] })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(id)
  await blog.updateOne({ ...request.body, user: blog.user })

  const updatedBlog = await Blog.findById(id)

  response.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(id)
  const user = await User.findById(decodedToken.id)

  if (blog.user.toString() === user._id.toString()) {
    await blog.remove()
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'unauthorized user' })
  }
})

// Comments
blogsRouter.get('/:id/comments', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)

  response.json(blog.comments)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)

  blog.comments = blog.comments.concat(request.body.comment)
  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
