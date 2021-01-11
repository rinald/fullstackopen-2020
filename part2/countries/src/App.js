import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_KEY = '914fc6d32af0e6c2baead66582113106'

const degToCompass = num => {
  var val = Math.floor(num / 22.5 + 0.5)
  var arr = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ]
  return arr[val % 16]
}

const Input = ({ text, controller }) => {
  const [value, setValue] = controller

  const handleChange = event => {
    setValue(event.target.value)
  }

  return (
    <div>
      {text} <input value={value} onChange={handleChange} />
    </div>
  )
}

const Weather = ({ data }) => {
  const { weather, main, wind } = data

  return (
    <div>
      <div>
        <b>Temperature:</b> {main.temp}°C, feels like {main.feels_like}°C
      </div>
      <div>
        <b>Description:</b> {weather[0].main}
      </div>
      <img
        src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
        alt={'weather icon'}
      ></img>
      <div>
        <b>Wind:</b> {wind.speed} m/s at {wind.deg}° ({degToCompass(wind.deg)})
      </div>
    </div>
  )
}

const Country = ({ country }) => {
  const { name, capital, population, languages, flag } = country
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${API_KEY}&units=metric`
      )
      .then(({ data }) => {
        setWeather(data)
      })
  }, [capital])

  return (
    <div>
      <h1>{name}</h1>
      <p>Capital: {capital}</p>
      <p>Population: {population}</p>
      <h2>Languages</h2>
      <ul>
        {languages.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <img height={100} src={flag} alt={'flag'}></img>
      <h2>Weather in {capital}</h2>
      {weather === null ? (
        <div>Loading weather data...</div>
      ) : (
        <Weather data={weather} />
      )}
    </div>
  )
}

const Countries = ({ countries, controller, filter }) => {
  const [showing, setShowing] = controller

  if (countries.length !== 0) {
    let matches = countries.filter(country =>
      country.name.toLowerCase().includes(filter.toLowerCase())
    )

    if (matches.length > 10) {
      return <div>Too many matches, specify another filter</div>
    } else if (matches.length > 1) {
      if (showing === null) {
        return matches.map(country => (
          <div key={country.name}>
            {country.name}
            <button onClick={() => setShowing(country)}>show</button>
          </div>
        ))
      } else {
        return (
          <div>
            <button onClick={() => setShowing(null)}>back</button>
            <Country country={showing} />
          </div>
        )
      }
    } else if (matches.length === 1) {
      return (
        <div>
          <Country country={matches[0]} />
        </div>
      )
    } else {
      return <div>No matches</div>
    }
  } else {
    return <div>Loading...</div>
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [showing, setShowing] = useState(null)

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(({ data }) => setCountries(data))
  }, [])

  return (
    <div>
      <Input text={'find countries'} controller={[search, setSearch]} />
      <Countries
        countries={countries}
        controller={[showing, setShowing]}
        filter={search}
      />
    </div>
  )
}

export default App
