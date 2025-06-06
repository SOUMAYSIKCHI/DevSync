import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name:"connections",
    initialState:null,
    reducers:{
    addConnections : (state,action)=>{
        return action.payload
    },
    }
});


export default connectionsSlice.reducer;
export const {addConnections} = connectionsSlice.actions;

