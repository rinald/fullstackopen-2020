import React from 'react'

const Notification = ({ status }) => {
  if (status === null) {
    return null
  }

  return <div className={status.outcome}>{status.message}</div>
}

export default Notification
