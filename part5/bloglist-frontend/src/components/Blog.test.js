import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let handler

  beforeEach(() => {
    handler = jest.fn()

    const blog = {
      title: 'test',
      author: 'tester',
      url: 'https://example.com/test',
      likes: 1,
      user: {
        name: 'tester',
      },
    }

    component = render(<Blog blog={blog} onLike={handler} />)
  })

  test('renders content', () => {
    const element = component.getByText('test tester')
    expect(element).toBeDefined()
  })

  test('details are shown after clicking view button', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const url = component.getByText('https://example.com/test')
    const likes = component.getByText('likes 1')

    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })

  test('like button is clicked twice', () => {
    // First we expand the component
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    // Then we press the like button twice
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(handler.mock.calls).toHaveLength(2)
  })
})
