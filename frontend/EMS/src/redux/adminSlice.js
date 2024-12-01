import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminname: '',
  organizationId: null, 
  organizationLogo:null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setadminname: (state, action) => {
      state.adminname= action.payload;
    },
    setorganizationId: (state, action) => {
      state.organizationId = action.payload;
    },
    setorganizationLogo: (state, action) => {
      state.organizationLogo = action.payload;
    },
    resetadmin: (state) => {
      state.adminname = '';
      state.organizationId = null;
      state.organizationLogo=null
    },
  },
});

export const { setadminname, setorganizationId, resetadmin,setorganizationLogo } = adminSlice.actions;
export default adminSlice.reducer;
