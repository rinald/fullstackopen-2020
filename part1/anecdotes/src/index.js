import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App, { anecdotes } from './App'

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'))
