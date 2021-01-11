require('dotenv').config()

const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

// App initialization
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (request, _) => {
  return JSON.stringify(request.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/info', (_, response) => {
  const date = new Date()

  Person.countDocuments({}, (error, count) => {
    if (error) {
      console.log(error)
    } else {
      response.send(
        `<p>Phonebook has info for ${count} people</p>
        <p>${date}</p>`
      )
    }
  })
})

// Fetch all people
app.get('/api/people', (_, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

// Fetch a single person
app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Delete a single person
app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(_ => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Add a new person
app.post('/api/people', (request, response, next) => {
  const body = request.body

  if (!body) {
    response.status(400).json({
      error: 'content missing',
    })
  } else if (!body.name || !body.number) {
    response.status(400).json({
      error: 'name or number missing',
    })
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person
      .save()
      .then(person => {
        response.json(person.toJSON())
      })
      .catch(error => next(error))
  }
})

// Update phone number of existing person
app.put('/api/people/:id', (request, response, next) => {
  const body = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { number: body.number },
    { new: true, runValidators: true }
  )
    .then(person => {
      response.json(person.toJSON())
    })
    .catch(error => next(error))
})

// Define error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
