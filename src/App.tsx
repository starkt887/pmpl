import { Redirect, Route, useHistory } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Login from "./pages/Login";

import React, { useEffect } from "react";
import Home from "./pages/Home";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import BuyTickets from "./pages/BuyTickets";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebaseClient";
import { loginSuccess } from "./features/authentication/authenticationSlice";

const App = () => {
  const isLoggedin = useAppSelector(
    (state) => state.AuthenticationState.isLoggedin
  );
 

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {isLoggedin ? (
            <>
              <Route path="/home" component={Home} exact />
              <Route path="/buytickets" component={BuyTickets} exact />
              <Route path="/login">
                <Redirect to="/home" />
              </Route>
              <Route path="/">
                <Redirect to="/home" />
              </Route>
            </>
          ) : (
            <>
              <Route path="/login" component={Login} exact />
              <Route path="/">
                <Redirect to="/login" />
              </Route>
            </>
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
