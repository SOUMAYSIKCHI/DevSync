import { createSlice } from "@reduxjs/toolkit";
const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    feedLen:0,
  },
  reducers: {
    setFeedLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addFeed: (state, action) => {
      const newUsers = action.payload;
      state.users = [...state.users, ...newUsers];
      if (newUsers.length === 0 || newUsers.length < 15) {
        state.hasMore = false;
      }
    },
    removeFeed: (state,action)=>{
      const newFeed = state.users.filter((user)=>user._id!==action.payload);
      state.users = newFeed;
      state.feedLen = newFeed.length;
    },
    incrementPage: (state,action) => {
      state.page += 1;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    getFeedLength: (state)=>{
      state.feedLen =  state.users.length;
    },
    resetFeed: (state) => {
      state.users = [];
      state.page = 1;
      state.hasMore = true;
      state.isLoading = false;
    }
  }
});

export const {
  addFeed,
  resetFeed,
  setFeedLoading,
  incrementPage,  
  setHasMore,
  removeFeed,
  getFeedLength
} = feedSlice.actions;


export default feedSlice.reducer;
