import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userService from '../services/users'
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

const Users = () => {
  let [users, setUsers] = useState(null)

  useEffect(() => {
    userService.getAll().then(_users => {
      setUsers(_users)
    })
  }, [])

  if (users === null) {
    return <div></div>
  }

  return (
    <Card>
      <CardHeader title='Users' />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Blogs created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link
                      style={{ color: 'black', textDecoration: 'none' }}
                      to={`/users/${user.id}`}
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default Users
