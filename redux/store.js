import { configureStore } from "@reduxjs/toolkit";
import leaveReducer from "./slices/leaveSlice";

export const store = configureStore({
    reducer : {
        leave:leaveReducer
    }
})