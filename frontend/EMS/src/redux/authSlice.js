import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    organization: {},
    adminname:"",
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setOrganization: (state, action) => {
            state.organization = action.payload;
        },
        setadminname:(state,action)=>
        {
            state.adminname=action.payload;
        },
        resetadminname:(state)=>
        {
            state.adminname="";
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        resetOrganization: (state) => {
            state.organization = {};
        },
    },
});

export const { setOrganization, setLoading, resetOrganization,setadminname,resetadminname } = authSlice.actions;
export default authSlice.reducer;
