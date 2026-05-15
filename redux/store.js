import { configureStore } from "@reduxjs/toolkit";
import leaveReducer from "./slices/leaveSlice";
import authReducer from "./slices/userSlice";

export const store = configureStore({
    reducer : {
        leave:leaveReducer,
        auth:authReducer
    }
})