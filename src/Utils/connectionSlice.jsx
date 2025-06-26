import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name:"connections",
    initialState:[],
    reducers:{
    addConnections : (state,action)=>{
        return action.payload
    },
    }
});


export default connectionsSlice.reducer;
export const {addConnections} = connectionsSlice.actions;

