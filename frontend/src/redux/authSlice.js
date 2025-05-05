import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employee: null,
  organization: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.employee = action.payload.employee;
      state.organization = action.payload.organization;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.employee = null;
      state.organization = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
