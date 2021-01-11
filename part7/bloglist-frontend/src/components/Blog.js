import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  Card,
  CardHeader,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
} from '@material-ui/core'

import { updateBlog, deleteBlog } from '../reducers/blogsReducer'
import { showNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

import { useField } from '../hooks'

var generateId = () => '_' + Math.random().toString(36).substr(2, 9)

const Blog = ({ id }) => {
  const dispatch = useDispatch()
  const [blog, setBlog] = useState(null)
  const { reset: resetComment, ...comment } = useField('text')

  useEffect(() => {
    blogService.getById(id).then(blog => setBlog(blog))
  }, [id])

  const handleLikes = async () => {
    blog.likes += 1

    await dispatch(updateBlog(blog))
    dispatch(
      showNotification({
        type: 'success',
        message: `You just liked ${blog.user.username}'s blog post`,
      })
    )
  }

  const handleRemove = async () => {
    const removeConfirmed = window.confirm(
      `Do you want to remove the blog '${blog.title}'`
    )

    try {
      if (removeConfirmed) {
        await dispatch(deleteBlog(blog))
        dispatch(
          showNotification({
            type: 'success',
            message: 'Blog removed successfully',
          })
        )
      }
    } catch (error) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Only the original creator can remove the blog',
        })
      )
    }
  }

  const handleComment = async event => {
    event.preventDefault()

    blog.comments = blog.comments.concat(comment.value)
    resetComment()
    setBlog(blog)

    await dispatch(updateBlog(blog))
    dispatch(
      showNotification({
        type: 'success',
        message: `A new comment '${comment.value}' added`,
      })
    )
  }

  return blog === null ? (
    <div></div>
  ) : (
    <div>
      <Card>
        <CardHeader title={blog.title} />
        <CardContent>
          <List>
            <ListItem button component='a' href={blog.url}>
              {blog.url}
            </ListItem>
            <ListItem>
              <ListItemText primary={`${blog.likes} likes`} />
              <ListItemSecondaryAction>
                <Button color='primary' onClick={handleLikes}>
                  Like
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary={`Added by ${blog.user.name}`} />
              <ListItemSecondaryAction>
                <Button color='primary' onClick={handleRemove}>
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>
      <Card style={{ marginTop: '10px' }}>
        <CardHeader title='Comments' />
        <CardContent>
          <form
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
            onSubmit={handleComment}
          >
            <TextField
              style={{ width: '30%' }}
              id='comment'
              label='Comment'
              {...comment}
            />
            <Button color='primary' type='submit'>
              Add comment
            </Button>
          </form>
          <List>
            {blog.comments.length !== 0 ? (
              blog.comments.map(comment => (
                <ListItem key={generateId()}>
                  <ListItemText primary={comment} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary='There are no comments yet.'></ListItemText>
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blog
