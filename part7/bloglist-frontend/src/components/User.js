import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core'

import userService from '../services/users'

const User = ({ id }) => {
  let [user, setUser] = useState(null)

  useEffect(() => {
    userService.getById(id).then(user => setUser(user))
  }, [id])

  if (user === null) {
    return <div></div>
  }

  return (
    <Card>
      <CardHeader title={user.name} />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Added blogs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.blogs.map(blog => (
                <TableRow key={blog.id}>
                  <TableCell>{blog.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default User
