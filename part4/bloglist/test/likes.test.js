const { blogs, totalLikes } = require('../utils/list_helper')

describe('Total likes', () => {
  test('No blog', () => {
    const result = totalLikes([])
    expect(result).toBe(0)
  })

  test('Single blog', () => {
    const result = totalLikes([blogs[0]])
    expect(result).toBe(7)
  })

  test('All blogs', () => {
    const result = totalLikes(blogs)
    expect(result).toBe(36)
  })
})
