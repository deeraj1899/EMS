import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employeeData: {},
  employeeId: null, 
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeId: (state, action) => {
      state.employeeId = action.payload;
    },
    setEmployeeData: (state, action) => {
      state.employeeData = action.payload;
    },
    resetEmployee: (state) => {
      state.employeeId = null;
      state.employeeData = {};
    },
  },
});

export const { setEmployeeId, setEmployeeData, resetEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
