import {  CPart} from "../types";
const Part = ({part}: CPart) => {
    switch (part.type) {
        case "normal":
            return <p><b>{part.name} {part.exerciseCount}</b><br/>
            {part.description}</p>
        case "groupProject":
            return <p><b>{part.name} {part.exerciseCount}</b> <br/>
            project exercises {part.groupProjectCount}</p>
        case "submission":
            return <p><b>{part.name} {part.exerciseCount}</b><br/> 
            {part.description} <br/>
            submit to {part.exerciseSubmissionLink}</p>
        case "special":
            return <p><b>{part.name} {part.exerciseCount}</b> <br/>
            {part.description}<br/>
            required skills: {part.requirements.join(', ')} </p>
        default:
            return assertNever(part);
    }
}

const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
export default Part;