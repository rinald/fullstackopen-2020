import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const _AnecdoteList = props => {
  const byMostVotes = (a, b) => b.votes - a.votes

  const vote = id => {
    const anecdote = props.anecdotes.find(obj => obj.id === id)
    props.voteAnecdote(id)
    props.showNotification(`you voted '${anecdote.content}'`, 5)
  }

  return (
    <div>
      {props.anecdotes
        .filter(anecdote =>
          anecdote.content.toLowerCase().includes(props.filter.toLowerCase())
        )
        .sort(byMostVotes)
        .map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter,
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  showNotification,
}

const AnecdoteList = connect(mapStateToProps, mapDispatchToProps)(_AnecdoteList)

export default AnecdoteList
