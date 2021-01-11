const { blogs, mostBlogs } = require('../utils/list_helper')

describe('Most blogs', () => {
  test('No blog', () => {
    const result = mostBlogs([])
    expect(result).toEqual({ author: '', blogs: 0 })
  })

  test('Single blog', () => {
    const result = mostBlogs([blogs[0]])
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1,
    })
  })

  test('All blogs', () => {
    const result = mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})
