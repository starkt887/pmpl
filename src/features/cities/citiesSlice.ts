import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICities {
  cities: string[];
}
const initialState: ICities = {
  cities:[]
};

const citiesSlice = createSlice({
  initialState,
  name: "Cities Slice",
  reducers: {
    addCities: (state,action:PayloadAction<string[]>) => {
      state.cities=action.payload
    },

  },
});

export const { addCities } = citiesSlice.actions;

export default citiesSlice.reducer;
