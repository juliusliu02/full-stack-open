const Course = ({ course }) => {
    return (
        <>
            <h1>{course.name}</h1>
            <Content parts={course.parts} />
        </>
    )
}

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part} />
            )}
            <Total parts={parts}></Total>
        </div>
    )
}

const Part = ({ part }) => {
    return (
        <p>{part.name} {part.exercises}</p>
    )
}

const Total = ({ parts }) => {
    const count = parts.reduce((total, current) => {return total + current.exercises}, 0);
    return (
        <p><b>
            total of {count} exercises
        </b></p>
    )
}

export default Course