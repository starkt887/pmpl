import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonButtons,
  IonIcon,
  IonModal,
} from "@ionic/react";
import { auth, fireStore } from "../services/firebaseClient";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { chevronBack } from "ionicons/icons";
import { useHistory } from "react-router";
import useToast from "../hooks/useToast.hook";
import React from "react";
import WalletModal from "../components/WalletModal";

const Profile = () => {
  const user = auth.currentUser;
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const { presentToast } = useToast();
  const history = useHistory();
  const [isWalletOpen, setisWalletOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(fireStore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setName(userSnap.data().name);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdateName = async () => {
    if (user) {
      try {
        const userRef = doc(fireStore, "users", user.uid);
        await updateDoc(userRef, { name });
        presentToast("Name updated successfully!", "success");
      } catch (error) {
        presentToast("Error updating name", "danger");
      }
    }
  };

  const handleChangePassword = async () => {
    if (user && oldPassword && newPassword.length >= 6) {
      const credential = EmailAuthProvider.credential(user.email!, oldPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        presentToast("Password updated successfully!", "success");
        setIsModalOpen(false);
      } catch (error: any) {
        presentToast(error.message, "danger");
      }
    } else {
      presentToast("Invalid password or missing fields", "warning");
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton
              slot="icon-only"
              fill="solid"
              onClick={() => history.goBack()}
            >
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <IonInput
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
          />
        </IonItem>
        <IonButton expand="full" onClick={handleUpdateName}>
          Update Name
        </IonButton>

        <IonItem>
          <IonLabel>Email</IonLabel>
          <IonInput value={email} readonly disabled />
        </IonItem>

        {/* Change Password Modal */}
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => setIsModalOpen(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Change Password</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="floating">Old Password</IonLabel>
              <IonInput
                type="password"
                value={oldPassword}
                onIonChange={(e) => setOldPassword(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">New Password</IonLabel>
              <IonInput
                type="password"
                value={newPassword}
                onIonChange={(e) => setNewPassword(e.detail.value!)}
              />
            </IonItem>
            <IonButton
              expand="full"
              color="success"
              onClick={handleChangePassword}
            >
              Update Password
            </IonButton>
            <IonButton
              expand="full"
              color="medium"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </IonButton>
          </IonContent>
        </IonModal>
        <IonButton
          expand="full"
          color="warning"
          onClick={() => setIsModalOpen(true)}
        >
          Change Password
        </IonButton>

        {/* wallet manage */}
        <WalletModal
          initialBalance={0}
          isOpen={isWalletOpen}
          onClose={() => setisWalletOpen(false)}
        />
        <IonButton
          expand="full"
          color="warning"
          onClick={() => setisWalletOpen(true)}
        >
          Wallet
        </IonButton>

        <IonButton expand="full" color="danger" onClick={handleLogout}>
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
