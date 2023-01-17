import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

// const reducer = (state = initialState, action) => {
//   console.log("state now: ", state);
//   console.log("action", action);

//   switch (action.type) {
//     case "SET_MESSAGE":
//       return action.payload;
//     case "REMOVE_MESSAGE":
//       return null;
//     default:
//       return state;
//   }
// };

// export const setMessage = (payload) => {
//   return {
//     type: "SET_MESSAGE",
//     payload,
//   };
// };
// export const removeMessage = () => {
//   return {
//     type: "REMOVE_MESSAGE",
//   };
// };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setMessage(state, action) {
      return action.payload;
    },
    removeMessage(state, action) {
      return null;
    },
  },
});
export const { setMessage, removeMessage } = notificationSlice.actions;
export default notificationSlice.reducer;

let timeoutId;
export const setNotification = (content, timeout) => {
  return async (dispatch) => {
    clearTimeout(timeoutId);
    dispatch(setMessage(content));
    timeoutId = setTimeout(() => {
      dispatch(removeMessage());
    }, timeout * 1000);
  };
};
