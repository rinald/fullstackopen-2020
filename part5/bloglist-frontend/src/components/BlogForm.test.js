import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('details are passed to the callback', () => {
  const handler = jest.fn()

  const component = render(<BlogForm onCreate={handler} />)

  const form = component.container.querySelector('form')
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  fireEvent.change(title, {
    target: { value: 'test' },
  })

  fireEvent.change(author, {
    target: { value: 'tester' },
  })

  fireEvent.change(url, {
    target: { value: 'https://example.com/test' },
  })

  fireEvent.submit(form)

  expect(handler.mock.calls).toHaveLength(1)
  expect(handler.mock.calls[0][0]).toStrictEqual({
    title: 'test',
    author: 'tester',
    url: 'https://example.com/test',
  })
})
