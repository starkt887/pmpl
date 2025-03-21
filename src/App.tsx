import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Register from "./pages/Register";
import React from "react";
import Home from "./pages/Home";

const App = () => {
  const { user } = useAuth();


  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            {user ? (
              <>
                <Route path="/home" component={Home} exact />
                <Route path="/">
                  <Redirect to="/home" />
                </Route>
              </>
            ) : (
              <>
                <Route path="/login" component={Login} exact />
                <Route path="/signup" component={Register} exact />
                <Route path="/">
                  <Redirect to="/login" />
                </Route>
              </>
            )}
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

export default App;
