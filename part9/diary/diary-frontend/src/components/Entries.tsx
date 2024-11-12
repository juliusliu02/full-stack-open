import { DiaryEntry } from "../types";

const Entry = ({ entry }: { entry: DiaryEntry }) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <p>visibility: {entry.visibility}</p>
      <p>weather: {entry.weather}</p>
    </div>
  )
}

const Entries = ({ entries }: { entries: DiaryEntry[] }) => {
  return (
    <>
      <h2>Diary entries</h2>
      {entries.map(
        (entry: DiaryEntry) => (<Entry key={entry.id} entry={entry}/>)
      )}
    </>
  )
}

export default Entries