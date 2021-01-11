const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

const User = require('../models/user')

usersRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const id = request.params.id

  const user = await User.findById(id).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
  })

  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.password.length < 3) {
    response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    delete body.password

    let user = new User({
      ...body,
      passwordHash,
    })

    user = await user.save()

    response.json(user)
  }
})

module.exports = usersRouter
