const { dummy } = require('../utils/list_helper')

test('dummy returns 1', () => {
  const blogs = []

  const result = dummy(blogs)
  expect(result).toBe(1)
})
