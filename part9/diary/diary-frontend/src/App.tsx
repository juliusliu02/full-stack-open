import { useEffect, useState } from 'react'
import { DiaryEntry, NewDiaryEntry } from "./types";
import { getAllDiaries, addDiary } from "./diaryService";
import Entries from "./components/Entries";
import NewEntryForm from "./components/NewEntryForm";
import axios from "axios";

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [error, setError] = useState<string>('')

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => setError(''), 5000)
  }

  useEffect(() => {
    getAllDiaries().then(data => setEntries(data))
  }, [])

  const createEntry = async (entry: NewDiaryEntry) => {
    try {
      const result = await addDiary(entry)
      setEntries(entries.concat(result))
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
        showError(error.response?.data)
      } else console.log(error)
    }
  }

  const errorStyle: React.CSSProperties = { color: 'red' }

  return (
    <>
      {error === '' ? null : <p style={errorStyle}>{error}</p>}
      <NewEntryForm createEntry={createEntry} />
      <Entries entries={entries}/>
    </>
  )
}

export default App
