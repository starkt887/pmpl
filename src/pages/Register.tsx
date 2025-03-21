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

const Register = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const history=useHistory()

  const handleRegister = async () => {
    try {
      await register(email, password);
      setMessage("Register successful! Please login.");
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
        <IonButton expand="block" onClick={handleRegister}>
          Sign Up
        </IonButton>

        <IonText className="ion-text-center">
          Already have an account?
          <IonButton fill="clear" onClick={() => history.goBack()}>
            Login
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

export default Register;
