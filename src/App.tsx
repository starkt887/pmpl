import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Register from "./pages/Register";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const { user } = useAuth();
  return (
    <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to="/login" />)} />
  );
};
  
const App = () => (
  <AuthProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={Login} exact />
          <Route path="/signup" component={Register} exact />
          <PrivateRoute path="/" component={() => <h1>Home Page</h1>} exact />
          <Redirect from="*" to="/" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AuthProvider>
);

export default App;
