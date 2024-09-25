import { useState } from 'react'

const Display = ({text}) => {
    return <h1>{text}</h1>
}

const Button = ({text, onClick}) => {
    return (
        <button onClick={onClick}>{text}</button>
    )
}

const StatisticLine = ({text, value}) => {
    return (
        <tbody>
            <tr>
                <td>{text}</td>
                <td>{value}</td>
            </tr>
        </tbody>
    )
}

const Statistics = ({good, neutral, bad}) => {
    const total = good + neutral + bad
    const average = total === 0 ? 0 : (good - bad) / total
    const positive = total === 0 ? 0 : good / total

    if (total === 0) {
        return (
            <p>No feedback given</p>
        )
    }
    return (
        <table>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={total} />
            <StatisticLine text='average' value={average} />
            <StatisticLine text='positive' value={positive} />
        </table>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <Display text='give feedback'></Display>
            <Button text='good' onClick={() => setGood(good + 1)}></Button>
            <Button text='neutral' onClick={() => setNeutral(neutral + 1)}></Button>
            <Button text='bad' onClick={() => setBad(bad + 1)}></Button>
            <Display text='statistics'/>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App