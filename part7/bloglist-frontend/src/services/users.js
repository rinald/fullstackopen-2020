import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async user => {
  const response = await axios.post(baseUrl, user)
  return response.data
}

const remove = async user => {
  await axios.delete(`${baseUrl}/${user.id}`)
}

const blogService = { getAll, getById, create, remove }
export default blogService
