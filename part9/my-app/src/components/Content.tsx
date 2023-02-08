import { Courses } from "../types";
import Part from "./Part";

const Content = ({courseParts}: Courses): JSX.Element => {
    return <>{courseParts.map((part)=> {
        return <Part key={part.name} part={part}/>
    })} </>
}

export default Content;