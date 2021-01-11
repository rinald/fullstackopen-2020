import React, { useState } from 'react'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async event => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url,
    }

    await onCreate(newBlog)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleCreate} className='blogForm'>
      <h2>create new</h2>
      <div>
        title:
        <input
          id='title'
          type='text'
          value={title}
          name='Title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          id='author'
          type='text'
          value={author}
          name='Author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          id='url'
          type='text'
          value={url}
          name='Url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit' id='createButton'>
        create
      </button>
    </form>
  )
}

export default BlogForm
