import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>
}

const Feedback = ({ onGood, onNeutral, onBad }) => {
  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={onGood} text='good' />
      <Button onClick={onNeutral} text='neutral' />
      <Button onClick={onBad} text='bad' />
    </div>
  )
}

const Statistic = ({ text, value, percent }) => (
  <tr>
    <td>{text}</td>
    <td>
      {value} {percent ? '%' : ''}
    </td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const avg = all !== 0 ? (good - bad) / all : 0
  const pos = all !== 0 ? (good / all) * 100 : 0

  if (all === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <Statistic text='good' value={good} />
          <Statistic text='neutral' value={neutral} />
          <Statistic text='bad' value={bad} />
          <Statistic text='all' value={all} />
          <Statistic text='average' value={avg} />
          <Statistic text='positive' value={pos} percent={true} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const { good, ok, bad } = store.getState()

  return (
    <div>
      <Feedback
        onGood={() => store.dispatch({ type: 'GOOD' })}
        onNeutral={() => store.dispatch({ type: 'OK' })}
        onBad={() => store.dispatch({ type: 'BAD' })}
      />
      <Statistics good={good} neutral={ok} bad={bad} />
    </div>
  )
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
