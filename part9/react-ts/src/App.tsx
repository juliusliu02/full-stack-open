interface CoursePartBase {
    name: string;
    exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
    description: string;
}

interface CoursePartBasic extends CoursePartDescription {
    kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
    groupProjectCount: number;
    kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
    backgroundMaterial: string;
    kind: "background"
}

interface CoursePartRequirement extends CoursePartDescription {
    requirements: string[];
    kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartRequirement;

const Part = ({part} : { part: CoursePart }) => {
    switch (part.kind) {
        case "basic":
            return (<div>
                <p><b>{part.name} {part.exerciseCount}</b></p>
                <p>{part.description}</p>
            </div>)
        case "group":
            return (<div>
                <p><b>{part.name} {part.exerciseCount}</b></p>
                <p>project exercises {part.groupProjectCount}</p>
            </div>)
        case "background":
            return (<div>
                <p><b>{part.name} {part.exerciseCount}</b></p>
                <p>{part.description}</p>
                <p>{part.backgroundMaterial}</p>
            </div>)
        case "special":
            return (<div>
                <p><b>{part.name} {part.exerciseCount}</b></p>
                <p>{part.description}</p>
                <p>required skills: {part.requirements.join(', ')}</p>
            </div>)
    }
}

const courseParts: CoursePart[] = [
    {
        name: "Fundamentals",
        exerciseCount: 10,
        description: "This is an awesome course part",
        kind: "basic"
    },
    {
        name: "Using props to pass data",
        exerciseCount: 7,
        groupProjectCount: 3,
        kind: "group"
    },
    {
        name: "Basics of type Narrowing",
        exerciseCount: 7,
        description: "How to go from unknown to string",
        kind: "basic"
    },
    {
        name: "Deeper type usage",
        exerciseCount: 14,
        description: "Confusing description",
        backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
        kind: "background"
    },
    {
        name: "TypeScript in frontend",
        exerciseCount: 10,
        description: "a hard part",
        kind: "basic",
    },
];

interface HeaderProps {
    name: string;
}

interface CourseParts {
    courses: CoursePart[];
}

interface TotalProps {
    totalExercises: number;
}

const Header = ({name}: HeaderProps) => {
    return (<h1>{name}</h1>)
}

const Content = ({courses}: CourseParts) => {
    return courses.map((course: CoursePart) => (
        <Part part={course}></Part>
    ))
}

const Total = ({ totalExercises }: TotalProps) => {
    return (<p>Number of exercises {totalExercises}</p>)
}

const App = () => {
    const courseName = "Half Stack application development";

    const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

    return (
        <div>
            <Header name={courseName} />
            <Content courses={courseParts} />
            <Total totalExercises={totalExercises} />
        </div>
    );
};

export default App;