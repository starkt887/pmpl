import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../features/authentication/authenticationSlice"
import loaderReducer from "../features/loader/loaderSlice"
import citiesReducer from "../features/cities/citiesSlice"
export const store=configureStore({
    reducer:{
        AuthenticationState:authenticationReducer,
        LoaderState:loaderReducer,
        CitiesState:citiesReducer
    }
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch