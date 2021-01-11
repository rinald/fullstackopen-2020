import React, { useState } from 'react'

const Blog = ({ blog, onLike, onRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleShowDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
        {showDetails ? (
          <div className='blogDetails'>
            <div>{blog.url}</div>
            <div>
              likes {blog.likes}{' '}
              <button onClick={() => onLike(blog)}>like</button>
            </div>
            <div>{blog.user.name}</div>
            <div>
              <button onClick={() => onRemove(blog)}>remove</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Blog
