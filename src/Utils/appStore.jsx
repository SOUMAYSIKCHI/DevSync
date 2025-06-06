import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import requestReducer from "./RequestSlice";
import connectionsReducer from "./connectionSlice";
const appStore = configureStore({
    reducer:{
        user: userReducer,
        feed: feedReducer,
        request: requestReducer,
        connections:connectionsReducer,
    }
});

export default appStore;
