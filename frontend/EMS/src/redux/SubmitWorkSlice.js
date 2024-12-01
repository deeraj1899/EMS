import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  submittedWorkId: null,
  submittedBy: null,
  githubLink: null,
  title: null,
  description: null,
};

const SubmitWorkSlice = createSlice({
  name: 'SubmitWork',
  initialState,
  reducers: {
    setSelectedWork: (state, action) => {
      state.submittedWorkId = action.payload.submittedWorkId;
      state.submittedBy = action.payload.submittedBy;
      state.githubLink = action.payload.githubLink;
      state.title = action.payload.title;
      state.description = action.payload.description;
    },
    clearSelectedWork: (state) => {
      state.submittedWorkId = null;
      state.submittedBy = null;
      state.githubLink = null;
      state.title = null;
      state.description = null;
    },
  },
});

export const { setSelectedWork, clearSelectedWork } = SubmitWorkSlice.actions;
export default SubmitWorkSlice.reducer;
