interface Course {
  name: string;
  exerciseCount: number;
}
export interface Courses {
  courseParts: CoursePart[];
}
export interface CPart {
  part: CoursePart;
}
// new types
interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CourseNormalPart extends NewType {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends NewType {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends NewType {
  type: "special";
  requirements: string[];
}

interface NewType extends CoursePartBase {
  description: string;
}
export type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecialPart;
