import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonPage,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { lockClosed, lockOpen, person, mic, arrowBack } from "ionicons/icons";
import "./Login.css";
import { loginSuccess } from "../features/authentication/authenticationSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useHistory } from "react-router";
import RegistrationModal from "../components/RegistrationModal";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireStore } from "../services/firebaseClient";
import {
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Loader from "../components/Loader";
import { loadingOff, loadingOn } from "../features/loader/loaderSlice";
import useToast from "../hooks/useToast.hook";

const Login = () => {
  const [Email, setEmail] = useState<string>();
  const [Password, setPassword] = useState<string>();
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [isRegistrationModalOpen, setisRegistrationModalOpen] = useState(false);
  const isLoading = useAppSelector((state) => state.LoaderState.loading);
  const { presentToast } = useToast();
    const isLoggedin = useAppSelector(
      (state) => state.AuthenticationState.isLoggedin
    );

  onAuthStateChanged(auth, (user) => {
    console.log(user?.uid);
    if (user) {
      dispatch(
        loginSuccess({
          email: user.email!,
          name: user.displayName!,
          uid: user.uid,
        })
      );
      console.log("loggin in");
    }
  });
  useEffect(() => {
    if (isLoggedin) {
      history.replace("/home");
    }
  }, [isLoggedin]);
  
  const handleLogin = () => {
    if (Email && Password) {
      dispatch(loadingOn());
      signInWithEmailAndPassword(auth, Email, Password)
        .then(async (userCredential) => {
          // Signed up
          const user = userCredential.user;

          const docSnap = await getDoc(doc(fireStore, "users", user.uid));
          if (docSnap.exists()) {
            presentToast("Login success!", "success");
            dispatch(
              loginSuccess({
                email: docSnap.get("email"),
                name: docSnap.get("name"),
                uid: user.uid,
              })
            );
            console.log("saving up", docSnap.get("unlock_phrase"));

            localStorage.setItem("unlock_phrase", docSnap.get("unlock_phrase"));
            history.replace("/home");
            dispatch(loadingOff());
          }

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Login Error:", errorCode, errorMessage);
          presentToast("Wrong username or password!", "danger");
          dispatch(loadingOff());
          // ..
        });
    }
  };

  return (
    <IonPage className="login">
      <IonContent class="ion-padding">
        {/* <IonButton onClick={() => makeDirectCall()}>Make a call</IonButton> */}

        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          setIsOpen={setisRegistrationModalOpen}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <div className="content">
            <IonList lines="none">
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Email"
                  labelPlacement="floating"
                  placeholder="Email"
                  type="email"
                  onIonChange={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="ion-margin-bottom">
                {" "}
                <IonInput
                  label="Password"
                  labelPlacement="floating"
                  placeholder="Password"
                  type="password"
                  onIonChange={(e) => setPassword(e.detail.value!)}
                >
                  {" "}
                </IonInput>
              </IonItem>

              <IonButton
                className="btnlogin"
                expand="full"
                onClick={handleLogin}
              >
                Login
              </IonButton>

              <IonButton
                className="btnlogin"
                expand="full"
                onClick={() => setisRegistrationModalOpen(true)}
              >
                Register
              </IonButton>
            </IonList>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Login;

// <IonInput
// placeholder="Enter Unlock Phrase"
// onIonChange={(e) => setUnlockPhrase(e.detail.value!)}
// />
