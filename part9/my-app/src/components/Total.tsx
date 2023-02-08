import { Courses } from "../types";

const Total = ({courseParts}: Courses) => {
return <p>
    Number of exercises{" "}
    {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>   
}

export default Total