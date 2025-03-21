import { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonToast,
  IonText,
} from "@ionic/react";
import { useAuth } from "../contexts/AuthContext";
import React from "react";
import { useHistory } from "react-router";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleLogin = async () => {
    try {
      await login(email, password);
      setMessage("Login successful!");
      history.replace("/")
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonInput
          placeholder="Email"
          onIonInput={(e) => setEmail(e.detail.value!)}
        />
        <IonInput
          placeholder="Password"
          type="password"
          onIonInput={(e) => setPassword(e.detail.value!)}
        />
        <IonButton expand="block" onClick={handleLogin}>
          Login
        </IonButton>

        <IonText className="ion-text-center">
          Dont have an account?
          <IonButton fill="clear" onClick={() => history.push("/signup")}>
            Sign Up
          </IonButton>
        </IonText>

        <IonToast
          isOpen={!!message}
          message={message}
          duration={2000}
          onDidDismiss={() => setMessage("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
