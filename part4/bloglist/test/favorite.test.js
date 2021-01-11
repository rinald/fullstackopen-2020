const { blogs, favoriteBlog } = require('../utils/list_helper')

describe('Favorite blog', () => {
  test('No blog', () => {
    const result = favoriteBlog([])
    expect(result).toEqual({})
  })

  test('Single blog', () => {
    const result = favoriteBlog([blogs[0]])
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('All blogs', () => {
    const result = favoriteBlog(blogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })
})
