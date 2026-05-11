import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    selectedLeave: null,
}

const leaveSlice = createSlice({
    name:"leave",
    initialState,
    reducers:{

        setSelectedLeave : (state, action) => {
            state.selectedLeave = action.payload;
        },

        clearSelectedLeave : (state) => {
            state.selectedLeave = null;
        }
    }
});

export const {
    setSelectedLeave,
    clearSelectedLeave
} = leaveSlice.actions;

export default leaveSlice.reducer;