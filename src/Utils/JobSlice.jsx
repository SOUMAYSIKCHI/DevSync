import { createSlice } from "@reduxjs/toolkit";

const JobSlice = createSlice({
    name:"job",
    initialState:[],
    reducers:{
    addJobs : (state,action)=>{
        return action.payload
    },
    }
});


export default JobSlice.reducer;
export const {addJobs} = JobSlice.actions;

