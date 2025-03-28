import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InputState {
  inputValue: number;
  inputValue2: number;
}

const initialState: InputState = {
  inputValue: 0,
  inputValue2: 0,
};

// Create a slice for managing input state
const inputSlice = createSlice({
  name: "input",
  initialState,
  reducers: {
    setInputValue: (state, action: PayloadAction<number>) => {
      state.inputValue = action.payload;
    },
    setInputValue2: (state, action: PayloadAction<number>) => {
      state.inputValue2 = action.payload;
    },
  },
});

// Export actions to dispatch in components
export const { setInputValue, setInputValue2 } = inputSlice.actions;

// Export the reducer to be used in the store
export default inputSlice.reducer;
