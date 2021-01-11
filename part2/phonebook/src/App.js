import React, { useState, useEffect } from 'react'
import axios from 'axios'

import './index.css'

const baseUrl = 'http://localhost:3001/persons'

const phoneService = {
  getAll: () => {
    const request = axios.get(baseUrl)
    return request.then(({ data }) => data)
  },
  add: person => {
    const request = axios.post(baseUrl, person)
    return request.then(({ data }) => data)
  },
  update: (id, person) => {
    const request = axios.put(`${baseUrl}/${id}`, person)
    return request.then(({ data }) => data)
  },
  delete: id => {
    return axios.delete(`${baseUrl}/${id}`)
  },
}

const Notification = ({ status }) => {
  if (status === null) {
    return null
  }

  return <div className={status.outcome}>{status.message}</div>
}

const Input = ({ text, controller }) => {
  const [value, setValue] = controller

  const handleChange = event => {
    setValue(event.target.value)
  }

  return (
    <div>
      {text} <input value={value} onChange={handleChange} />
    </div>
  )
}

const Filter = ({ controller }) => (
  <Input text={'filter shown with '} controller={controller} />
)

const PersonForm = ({ nameController, numberController, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <Input text={'name: '} controller={nameController} />
      <Input text={'number: '} controller={numberController} />
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, filter, onDelete }) => {
  return persons
    .filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase()))
    .map(({ name, number, id }) => (
      <div key={name}>
        {name} {number}
        <button onClick={() => onDelete(id)}>delete</button>
      </div>
    ))
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState(null)

  useEffect(() => {
    phoneService.getAll().then(data => setPersons(data))
  }, [])

  const handleAdd = event => {
    event.preventDefault()

    let existingPerson = persons.find(element => element.name === newName)

    if (existingPerson) {
      existingPerson.number = newNumber
      const update = window.confirm(
        `${newName} is already added to phonebook. Replace the old number with a new one?`
      )

      if (update) {
        phoneService
          .update(existingPerson.id, existingPerson)
          .then(data => {
            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id ? person : data
              )
            )
            setStatus({
              message: `Updated ${data.name}'s phone number`,
              outcome: 'success',
            })
            setNewName('')
            setNewNumber('')
            setTimeout(() => {
              setStatus(null)
            }, 5000)
          })
          .catch(error => {
            setStatus({
              message: `${existingPerson.name}'s information has already been removed from server`,
              outcome: 'error',
            })
            setTimeout(() => {
              setStatus(null)
            }, 5000)
            setPersons(
              persons.filter(person => person.id !== existingPerson.id)
            )
          })
      } else {
        return
      }
    } else {
      phoneService.add({ name: newName, number: newNumber }).then(data => {
        setPersons([...persons, data])
        setStatus({ message: `Added ${data.name}`, outcome: 'success' })
        setNewName('')
        setNewNumber('')
        setTimeout(() => {
          setStatus(null)
        }, 5000)
      })
    }
  }

  const handleDelete = id => {
    const _delete = window.confirm(
      `Delete ${persons.find(person => person.id === id).name}`
    )

    if (_delete) {
      phoneService.delete(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification status={status} />
      <Filter controller={[filter, setFilter]} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={handleAdd}
        nameController={[newName, setNewName]}
        numberController={[newNumber, setNewNumber]}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} onDelete={handleDelete} />
    </div>
  )
}

export default App
