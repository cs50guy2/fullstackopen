// const initialState = anecdotesAtStart.map(asObject);

// const reducer = (state = initialState, action) => {
//   console.log("state now: ", state);
//   console.log("action", action);

//   switch (action.type) {
//     case "INCREMENT_VOTE":
//       const newState = state.map((anecdote) =>
//         anecdote.id !== action.data.id
//           ? anecdote
//           : { ...anecdote, votes: anecdote.votes + 1 }
//       );
//       // .sort((a, b) => (a.votes < b.votes ? 1 : -1));
//       return newState;
//     case "CREATE_ANECDOTE":
//       return state.concat(action.data);
//     default:
//       return state;
//   }
// };

// export const incrementVote = (id) => {
//   return {
//     type: "INCREMENT_VOTE",
//     data: {
//       id,
//     },
//   };
// };
// export const createAnecdote = (anecdote) => {
//   return { type: "CREATE_ANECDOTE", data: asObject(anecdote) };
// };

// export default reducer;

import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    incrementVote(state, action) {
      return state.map((anecdote) =>
        anecdote.id !== action.payload
          ? anecdote
          : { ...anecdote, votes: anecdote.votes + 1 }
      );
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});
export const { incrementVote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;
export default anecdoteSlice.reducer;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const addVote = (id) => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    const newObject = anecdotes.find((anecdote) => anecdote.id === id);
    const updatedAnecdote = await anecdoteService.update(id, {
      ...newObject,
      votes: newObject.votes + 1,
    });
    console.log("updatedAnecdote :>> ", updatedAnecdote);
    dispatch(incrementVote(id));
  };
};
