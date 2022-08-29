import { createSlice } from "@reduxjs/toolkit";

export interface inputFocusState {
  inputFocus: number
}

const initialState = {
    inputFocus: 0
}

const inputFocusSlice = createSlice({
  name: 'inputFocusSlice',
  initialState,
  reducers: {
    inputFocus: (state, action) => {
      state.inputFocus = action.payload;
    },
  }
})

export const {inputFocus} = inputFocusSlice.actions
export default inputFocusSlice.reducer
