import { createSlice } from "@reduxjs/toolkit";

const msgNotificationSlice = createSlice({
    name:"msgnotif",
    initialState:[],
    reducers:{
    addMsgNotification : (state,action)=>{
        state.push(action.payload);
    },
    clearMsgNotification :(state,action)=>{
        return [];
    }
    }
});


export default msgNotificationSlice.reducer;
export const {addMsgNotification,clearMsgNotification} = msgNotificationSlice.actions;

