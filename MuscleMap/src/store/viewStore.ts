import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentBodyView: "front" as "front" | "back",
};

const viewStore = createSlice({
  name: "view",
  initialState,
  reducers: {
    toggleView(state) {
      state.currentBodyView =
        state.currentBodyView === "front" ? "back" : "front";
    },
  },
});

export const { toggleView } = viewStore.actions;
export default viewStore.reducer;
