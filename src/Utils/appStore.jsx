import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import requestReducer from "./RequestSlice";
import connectionsReducer from "./connectionSlice";
import JobReducer from "./JobSlice";
import msgNotificationReducer from "./msgNotificationSlice";
const appStore = configureStore({
    reducer:{
        user: userReducer,
        feed: feedReducer,
        request: requestReducer,
        connections:connectionsReducer,
        job:JobReducer,
        msgnotif:msgNotificationReducer
    }
});

export default appStore;
