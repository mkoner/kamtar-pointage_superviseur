import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import missionReducer from "./features/missionSlice";
import repportReducer from "./features/repportSlice"
import commentReducer from './features/commentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    missions: missionReducer,
    repports: repportReducer,
    comments: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});
