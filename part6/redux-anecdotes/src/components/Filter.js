import React from 'react'
import { connect } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const _Filter = props => {
  const handleChange = event => props.setFilter(event.target.value)

  const style = {
    marginBottom: 10,
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const mapDispatchToProps = {
  setFilter,
}

const Filter = connect(null, mapDispatchToProps)(_Filter)
export default Filter
