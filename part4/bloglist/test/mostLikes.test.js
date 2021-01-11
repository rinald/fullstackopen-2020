const { blogs, mostLikes } = require('../utils/list_helper')

describe('Most liked author', () => {
  test('No blog', () => {
    const result = mostLikes([])
    expect(result).toEqual({ author: '', likes: 0 })
  })

  test('Single blog', () => {
    const result = mostLikes([blogs[0]])
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('All blogs', () => {
    const mostLiked = mostLikes(blogs)
    const result =
      (mostLiked.author === 'Michael Chan' ||
        mostLiked.author === 'Edsger W. Dijkstra' ||
        mostLiked.author === 'Robert C. Martin') &&
      mostLiked.likes === 12

    expect(result).toBe(true)
  })
})
