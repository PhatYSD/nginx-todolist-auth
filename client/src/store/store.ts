import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import authSlice from "./slices/authSlice";
import listSlice from "./slices/listSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        list: listSlice
    },
    devTools: import.meta.env.MODE === "development"
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();