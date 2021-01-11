import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async content => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const vote = async id => {
  const anecdote = await axios.get(`${baseUrl}/${id}`)
  const response = await axios.put(`${baseUrl}/${id}`, {
    ...anecdote.data,
    votes: anecdote.data.votes + 1,
  })
  return response.data
}

const anecdoteService = { getAll, createNew, vote }
export default anecdoteService
