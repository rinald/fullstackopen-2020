import React, { useState } from 'react'

const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min)) + min
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
]

const App = props => {
  const [selected, setSelected] = useState(0)
  const [best, setBest] = useState(null)
  const [votes, setVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  })

  const onNext = () => {
    let _selected = getRandomInt(0, anecdotes.length)
    setSelected(_selected)
  }

  const onVote = () => {
    let _votes = { ...votes }
    _votes[selected] += 1
    setVotes(_votes)

    if (_votes[selected] > _votes[best] || best === null) {
      setBest(selected)
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}
      <p>has {votes[selected]} votes</p>
      <button onClick={onVote}>vote</button>
      <button onClick={onNext}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{best !== null ? anecdotes[best] : 'Be sure to vote first'}</p>
    </div>
  )
}

export default App
export { anecdotes }
