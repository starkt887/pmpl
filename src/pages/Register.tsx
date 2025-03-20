import { useState } from "react";
import { IonPage, IonContent, IonInput, IonButton, IonToast } from "@ionic/react";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const { Register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await Register(email, password);
      setMessage("Register successful! Please login.");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonInput placeholder="Email" onIonChange={(e) => setEmail(e.detail.value!)} />
        <IonInput placeholder="Password" type="password" onIonChange={(e) => setPassword(e.detail.value!)} />
        <IonButton expand="block" onClick={handleRegister}>Sign Up</IonButton>
        <IonToast isOpen={!!message} message={message} duration={2000} onDidDismiss={() => setMessage("")} />
      </IonContent>
    </IonPage>
  );
};

export default Register;
