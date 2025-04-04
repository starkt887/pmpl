import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAuthenticationState {
  isLoggedin: boolean;
  uid: string;
  email: string;
  name: string;
  wallet: number;
}

const initialState: IAuthenticationState = {
  isLoggedin: false,
  uid: "",
  email: "",
  name: "",
  wallet: 0,
};

export const authenticationSlice = createSlice({
  initialState,
  name: "Authentication Slice",
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<Omit<IAuthenticationState, "isLoggedin">>
    ) => {
      return {
        isLoggedin: true,
        uid: action.payload.uid,
        email: action.payload.email,
        name: action.payload.name,
        wallet: action.payload.wallet,
      };
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.wallet = action.payload;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { loginSuccess,updateBalance, logout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
