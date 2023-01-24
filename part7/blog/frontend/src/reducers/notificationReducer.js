import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
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
