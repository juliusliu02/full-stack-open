import {useEffect, useState} from 'react'
import './App.css'
import countriesService from './services/countries.js'

const Filter = ({ handleChange }) => {
  return (
      <>
        filter shown with <input onChange={handleChange} />
      </>
  )
}

const Country = ({ country }) => {
  return (
      <>
          <h1>{country.name.common}</h1>
          <p>Capital: {country.capital}</p>
          <p>Area: {country.area}</p>
          <p>Languages: {Object.values(country.languages).map(lang => (<li key={lang}>{lang}</li>))}</p>
      </>
  )
}

const Countries = ({countries, selectCountry}) => {
    if (countries.length > 10) {
        return (<>Too many matches, specify another filter.</>)
  }
  if (countries.length === 1) {
    return (<>
      <Country country={countries[0]} />
    </>)
  }

  return (
      <>
        {countries.map((country) => (
            <>
                <li key={country.name.common}>{country.name.common}</li>
                <button key={'btn' + country.name.common} onClick={() => selectCountry(country.name.common)}>show</button>
            </>
        ))}
      </>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const findCountries = (query) => {
    return countries.filter((country) => country.name.common.toLowerCase().includes(query.toLowerCase()))
  }

  const selectCountry = (country) => {
      setQuery(country)
  }

  useEffect(() => {
    countriesService.getAll().then((response) => {
      setCountries(response)
    })
  }, [])

  return (
      <>
        <Filter handleChange={handleQueryChange}></Filter>
        <br/>
        <Countries countries={ query === '' ? [] : findCountries(query)} selectCountry={selectCountry} />
      </>
  )
}

export default App
