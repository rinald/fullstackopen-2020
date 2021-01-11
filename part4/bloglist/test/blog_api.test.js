const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')

const app = require('../app')

const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let TEST_AUTH

describe('Blog tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany()
    await User.deleteMany()

    for (let user of helper.initialUsers) {
      await api.post('/api/users').send(user)
    }

    const auth = await api.post('/api/login').send({
      username: 'user',
      password: '1234',
    })

    TEST_AUTH = `Bearer ${auth.body.token}`

    for (let blog of helper.initialBlogs) {
      await api.post('/api/blogs').send(blog).set('Authorization', TEST_AUTH)
    }
  })

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('Blog has id', async () => {
    const blogs = await api.get('/api/blogs')

    expect(blogs.body[0].id).toBeDefined()
  })

  test('New blog added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'User',
      url: 'https://example.com/new-blog',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', TEST_AUTH)
      .expect(201)
      .expect('Content-Type', /json/)

    const blogs = await helper.blogsInDB()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogs.map(blog => blog.title)
    expect(titles).toContain('New blog')
  })

  test('Likes default to 0', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'User',
      url: 'http://example.com/new-blog',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', TEST_AUTH)
      .expect(201)
      .expect('Content-Type', /json/)

    const blogs = await helper.blogsInDB()

    expect(blogs[blogs.length - 1].likes).toBeDefined()
    expect(blogs[blogs.length - 1].likes).toBe(0)
  })

  test('Bad request', async () => {
    const newBlog = {
      author: 'User',
      url: 'http://example.com/new-blog',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', TEST_AUTH)
      .expect(400)
  })

  test('Delete successful', async () => {
    const initialLength = helper.initialBlogs.length

    let blogs = await helper.blogsInDB()
    const id = blogs[0].id

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', TEST_AUTH)
      .expect(204)

    blogs = await helper.blogsInDB()

    expect(blogs.length).toBe(initialLength - 1)
  })
})

describe('User tests', () => {
  beforeEach(async () => {
    await User.deleteMany()

    for (let user of helper.initialUsers) {
      await api.post('/api/users').send(user)
    }
  })

  test('There is a single user', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(1)
    expect(response.body[0].username).toBe('user')
  })

  test('User created successfully', async () => {
    const newUser = {
      username: 'new_user',
      name: 'New User',
      password: '1234',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('Short password', async () => {
    const newUser = {
      username: 'new_user',
      name: 'New User',
      password: '12',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })
})

describe('Users and blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany()
    await User.deleteMany()

    for (let user of helper.initialUsers) {
      await api.post('/api/users').send(user)
    }

    const auth = await api.post('/api/login').send({
      username: 'user',
      password: '1234',
    })

    TEST_AUTH = `Bearer ${auth.body.token}`
  })

  test('Blog contains user information', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'User',
      url: 'http://example.com/new-blog',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', TEST_AUTH)
      .expect(201)
      .expect('Content-Type', /json/)

    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    expect(blog.user).toBeDefined()
    expect(blog.user.username).toBe('user')
  })

  test('User contains a list of blogs', async () => {
    let response = await api.get('/api/users')
    let user = response.body[0]

    // Initially the user has no blogs, empty list
    expect(user.blogs).toBeDefined()
    expect(user.blogs.length).toBe(0)

    const newBlog = {
      title: 'New blog',
      author: 'User',
      url: 'http://example.com/new-blog',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', TEST_AUTH)
      .expect(201)
      .expect('Content-Type', /json/)

    // The blog has been added to the user's blog list
    response = await api.get('/api/users')
    user = response.body[0]

    expect(user.blogs.length).toBe(1)
    expect(user.blogs[0].title).toBe(newBlog.title)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
