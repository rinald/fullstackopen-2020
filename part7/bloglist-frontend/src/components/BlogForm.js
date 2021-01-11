import React from 'react'
import { useField } from '../hooks'

import { TextField, Button, Typography } from '@material-ui/core'

const BlogForm = ({ onCreate }) => {
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')

  const handleCreate = async event => {
    event.preventDefault()

    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    }

    await onCreate(newBlog)

    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <form onSubmit={handleCreate} className='blogForm'>
      <div style={{ marginTop: '40px' }}>
        <Typography variant='h4'>Create new</Typography>
      </div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <TextField
          label='Title'
          style={{ width: '30%' }}
          {...title}
        ></TextField>
      </div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <TextField
          label='Author'
          style={{ width: '30%' }}
          {...author}
        ></TextField>
      </div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <TextField label='Url' style={{ width: '30%' }} {...url}></TextField>
      </div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <Button
          style={{ marginTop: '10px' }}
          variant='contained'
          color='primary'
          type='submit'
        >
          Create
        </Button>
      </div>
    </form>
  )
}

export default BlogForm
