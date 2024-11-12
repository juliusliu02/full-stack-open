import React, { Fragment, useState } from "react";
import { NewDiaryEntry } from "../types";

const NewEntryForm = ({ createEntry }: { createEntry: (object: NewDiaryEntry) => void }) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');

  const handleAdd = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const entryToAdd = {
      date,
      visibility,
      weather,
      comment
    }
    createEntry(entryToAdd)
    setDate('')
    setVisibility('')
    setWeather('')
    setComment('')
  }

  const weatherOptions: string[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy']
  const visibilityOptions: string[] = ['great', 'good', 'okay', 'poor']

  const getRadioButtons = (name: string, select: React.Dispatch<React.SetStateAction<string>>, options: string[]) => {
    return (
      <div>
        {name} {options.map(option => (
        <Fragment key={option}>
          {option}<input type='radio' name={name} onChange={() => select(option)}/>
        </Fragment>
      ))}
      </div>
    )
  }

  return (
    <>
      <h2>Add new entry</h2>
      <form onSubmit={handleAdd}>
        <div>date <input type='date' onChange={(e) => setDate(e.target.value)} value={date} /></div>
        {getRadioButtons('visibility', setVisibility, visibilityOptions)}
        {getRadioButtons('weather', setWeather, weatherOptions)}
        <div>comment <input onChange={(e) => setComment(e.target.value)} value={comment} /></div>
        <button type='submit'>Add</button>
      </form>
    </>
  )
}

export default NewEntryForm;