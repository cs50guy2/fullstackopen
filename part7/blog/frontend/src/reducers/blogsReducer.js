import { createSlice } from '@reduxjs/toolkit';

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlogs(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});
export const { appendBlogs, setBlogs } = blogsSlice.actions;
export default blogsSlice.reducer;
