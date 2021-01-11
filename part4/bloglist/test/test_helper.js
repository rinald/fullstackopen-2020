const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'User',
    url: 'https://example.com/blog-1',
    likes: 20,
  },
  {
    title: 'Blog 2',
    author: 'User',
    url: 'https://example.com/blog-2',
    likes: 10,
  },
]

const initialUsers = [
  {
    username: 'user',
    name: 'User',
    password: '1234',
  },
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})

  return blogs.map(blog => blog.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDB,
  usersInDB,
}
