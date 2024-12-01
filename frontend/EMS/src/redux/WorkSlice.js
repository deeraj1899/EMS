import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  selectedEmployeeId: null,
  work: { title: '', description: '', due_date: '' },
};

const WorkSlice = createSlice({
  name: 'work',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.selectedEmployeeId = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedEmployeeId = null;
      state.work = { title: '', description: '', due_date: '' };
    },
    setWorkData: (state, action) => {
      state.work = { ...state.work, ...action.payload };
    },
    clearWorkData: (state) => {
      state.isModalOpen = false;
      state.selectedEmployeeId = null;
      state.work = { title: '', description: '', due_date: '' };
    },
  },
});

export const { openModal, closeModal, setWorkData, clearWorkData } = WorkSlice.actions;
export default WorkSlice.reducer;
