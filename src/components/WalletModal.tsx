import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonFooter,
} from "@ionic/react";
import useToast from "../hooks/useToast.hook";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { ITicket } from "./PaymentDetails";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { fireStore } from "../services/firebaseClient";
import { updateBalance } from "../features/authentication/authenticationSlice";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBalance: number;
}
export interface IWalletModal {
  id: string;
  balance: number;
  paymentId: string;
  orderId: string;
  signature: string;
  timestamp: Timestamp;
}

const WalletModal = ({ isOpen, onClose, initialBalance }: WalletModalProps) => {
  const wallet = useAppSelector((state) => state.AuthenticationState.wallet);
  const [amountToAdd, setAmountToAdd] = useState<number | undefined>();
  const { presentToast } = useToast();
  const { error, isLoading, Razorpay: rzpay } = useRazorpay();
  const uid = useAppSelector((state) => state.AuthenticationState.uid);
  const dispatch = useAppDispatch();
  const handlePayment = async () => {
    if (amountToAdd) {
      const response = await fetch(
        "https://pmplbackend.vercel.app/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: amountToAdd, currency: "INR" }),
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);

        const options: RazorpayOrderOptions = {
          key: "rzp_test_NxAV4QBfEPwxiL",
          amount: amountToAdd, // Amount in paise
          currency: "INR",
          name: "Bus Bookings",
          description: "Ticket/Pass Booking",
          order_id: responseData.orderId, // Generate order_id on server
          handler: async (response) => {
            console.log(response);
            const verificationPayload = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            };
            try {
              const verifyResponse = await fetch(
                "https://pmplbackend.vercel.app/verify-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(verificationPayload),
                }
              );

              const verifyData = await verifyResponse.json();

              if (verifyData.success) {
                // alert("Payment Successful!");
                const walletUpdate: IWalletModal = {
                  id: uid,
                  balance: amountToAdd,
                  timestamp: Timestamp.now(),
                  ...verificationPayload,
                };
                presentToast("Ticket Purchase success!", "success");
                pushWalletDetails(walletUpdate);
              } else {
                throw new Error("Payment verification failed!");
              }
            } catch (error) {
              console.error("Payment error:", error);
              // alert("Payment failed! Please try again.");
              presentToast("Payment failed! Please try again.", "danger");
            }
          },
          prefill: {
            name: "John Doe",
            email: "john.doe@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#F37254",
          },
        };

        const razorpayInstance = new rzpay(options);
        razorpayInstance.open();
      }
    }
  };
  const pushWalletDetails = async ({
    id,
    balance,
    timestamp,
    orderId,
    paymentId,
    signature,
  }: IWalletModal) => {
    // setBalance((prev) => prev + amountToAdd);
    try {
      const docRef = doc(fireStore, "users", uid);
      await updateDoc(docRef, { wallet: wallet + balance });
      await addDoc(collection(fireStore, "orders"), {
        id: uid,
        balance,
        timestamp,
        orderId,
        paymentId,
        signature,
      });
      dispatch(updateBalance(wallet + balance));
      presentToast(`Amount ${amountToAdd} successfully!`, "success");
      setAmountToAdd(undefined);
    } catch (error) {
      presentToast("Payment failed to sync! Please try again.", "danger");
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Wallet</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Current Balance:</IonLabel>
          <IonText color="primary">
            <strong> ₹{wallet}</strong>
          </IonText>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Add Funds</IonLabel>
          <IonInput
            type="number"
            placeholder="Enter amount"
            value={amountToAdd}
            onIonInput={(e) => setAmountToAdd(parseFloat(e.detail.value!))}
          />
        </IonItem>

        <IonButton expand="block" onClick={handlePayment}>
          Add Funds
        </IonButton>
      </IonContent>
      <IonFooter className="ion-padding">
        <IonButton expand="block" color="medium" onClick={onClose}>
          Close
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

export default WalletModal;
