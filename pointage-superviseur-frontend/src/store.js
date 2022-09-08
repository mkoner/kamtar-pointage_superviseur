import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import missionReducer from "./features/missionSlice";
import repportReducer from "./features/repportSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    missions: missionReducer,
    repports: repportReducer,
  },
});
