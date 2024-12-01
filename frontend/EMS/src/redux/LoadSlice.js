import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isLoading: false,
};

const LoadSlice = createSlice({
  name: 'Load',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = LoadSlice.actions;
export default LoadSlice.reducer;
