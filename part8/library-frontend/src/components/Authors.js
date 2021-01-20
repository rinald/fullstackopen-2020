import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = props => {
  const { loading, error, data } = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: error => console.log(error.graphQLErrors),
  })

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  useEffect(() => {
    if (data) {
      setName(data.allAuthors[0].name)
    }
  }, [data])

  if (!props.show || loading) {
    return null
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const submit = event => {
    event.preventDefault()

    editAuthor({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <label>
          name
          <select
            onChange={({ target }) => setName(target.value)}
            defaultValue={data.allAuthors[0].name}
          >
            {data.allAuthors.map(author => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
          <div>
            <button type="submit">update author</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Authors
