import blogService from '../services/blogs'

const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({ type: 'INIT_BLOGS', data: blogs })
  }
}

const updateBlog = blog => {
  return async dispatch => {
    await blogService.update(blog)

    dispatch({ type: 'UPDATE_BLOG', data: blog })
  }
}

const deleteBlog = blog => {
  return async dispatch => {
    await blogService.remove(blog)

    dispatch({ type: 'DELETE_BLOG', data: blog })
  }
}

const addBlog = blog => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    dispatch({ type: 'ADD_BLOG', data: newBlog })
  }
}

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.data
    case 'ADD_BLOG':
      return [...state, action.data]
    case 'DELETE_BLOG':
      return state.filter(blog => blog.id !== action.data.id)
    case 'UPDATE_BLOG':
      let index = state.findIndex(blog => blog.id === action.data.id)
      let newState = [...state]
      newState[index] = action.data

      return newState
    default:
      return state
  }
}

export { initializeBlogs, addBlog, updateBlog, deleteBlog }
export default reducer
