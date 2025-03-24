import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonSearchbar,
  IonText,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  arrowForward,
  arrowUp,
  bus,
  calendarOutline,
  chevronBack,
  chevronForward,
  ellipsisVerticalOutline,
  search,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { fireStore } from "../services/firebaseClient";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addCities } from "../features/cities/citiesSlice";
import PaymentDetails, { PaymentType } from "../components/PaymentDetails";
import { DateTime } from "../utils/luxon";
import { updateRoutesWithTimestamp } from "../utils/setupDb";
import useToast from "../hooks/useToast.hook";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";

export interface IDailyPass {
  id: string;
  type: string;
  cost: number;
  paymentId: string;
  orderId: string;
  signature: string;
  timestamp: Timestamp;
}
const DailyPass = () => {
  const history = useHistory();
  const [selectedPass, setselectedPass] = useState<string>();
  const [Cost, setCost] = useState<number>();
  const [aadharNo, setaadharNo] = useState<string>();
  const { presentToast } = useToast();
  const uid = useAppSelector((state) => state.AuthenticationState.uid);
  const { error, isLoading, Razorpay: rzpay } = useRazorpay();

  const setPassDetails = (value: string) => {
    setselectedPass(value);
    switch (value) {
      case "PMC":
        setCost(40);
        break;
      case "PCMC":
        setCost(40);
        break;
      case "PMC and PCMC":
        setCost(50);
        break;
      case "All Routes":
        setCost(120);
        break;
    }
  };
  const handlePayment = async () => {
    if (Cost) {
      const response = await fetch(
        "https://pmplbackend.vercel.app/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: Cost, currency: "INR" }),
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);

        const options: RazorpayOrderOptions = {
          key: "rzp_test_NxAV4QBfEPwxiL",
          amount: Cost, // Amount in paise
          currency: "INR",
          name: "PMPL Bookings",
          description: "Daily Pass/Pass Booking",
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
                const passCollectionPayload: IDailyPass = {
                  id: uid,
                  type: (selectedPass && selectedPass) || "",
                  cost: Cost,
                  timestamp: Timestamp.now(),
                  ...verificationPayload,
                };
                presentToast("Daily Pass Purchase success!", "success");
                pushPassDetails(passCollectionPayload);
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

  const pushPassDetails = async (passCollectionPayload: IDailyPass) => {
    console.log("add ticket");
    try {
      await addDoc(collection(fireStore, "dailypasses"), passCollectionPayload);
      console.log("Added the tickets!");
      setPassDetails("");
    } catch (error) {
      console.log("Add tickets error:", error);
    }
  };

  const pushPassDetails2 = async () => {
    console.log("add ticket");
    try {
      const passCollectionPayload: IDailyPass = {
        id: uid,
        type: (selectedPass && selectedPass) || "",
        cost: Cost || 0,
        timestamp: Timestamp.now(),
        orderId: "test_order_id",
        paymentId: "test_payment_id",
        signature: "test_signature",
      };

      await addDoc(collection(fireStore, "dailypasses"), passCollectionPayload);
      console.log("Added the tickets!");
      setPassDetails("");
      presentToast("Daily Pass Purchase success!", "success");
    } catch (error) {
      console.log("Add tickets error:", error);
      presentToast("Payment failed! Please try again.", "danger");
    }
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

          <IonText className="app-title">Daily Pass</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem
            color="secondary"
            className="ion-margin-top"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <IonIcon
              size="large"
              src={calendarOutline}
              className="ion-padding-end"
            />
            <IonLabel class="ion-no-margin">
              <p>{DateTime.now().toFormat("MMMM dd, yyyy hh:mm")}</p>
            </IonLabel>
          </IonItem>
          <IonRadioGroup
            value={selectedPass}
            onIonChange={(e) => setPassDetails(e.detail.value!)}
          >
            <IonItemGroup>
              <IonItem>
                <IonLabel>Only PMC - ₹ 40</IonLabel>
                <IonRadio slot="start" value={"PMC"} />
              </IonItem>
              <IonItem>
                <IonLabel>Only PCMC - ₹ 40</IonLabel>
                <IonRadio slot="start" value={"PCMC"} />
              </IonItem>
              <IonItem>
                <IonLabel>PMC and PCMC - ₹ 50</IonLabel>
                <IonRadio slot="start" value={"PMC and PCMC"} />
              </IonItem>
              <IonItem>
                <IonLabel>All Routes - ₹ 120</IonLabel>
                <IonRadio slot="start" value={"All Routes"} />
              </IonItem>
            </IonItemGroup>
          </IonRadioGroup>

          <br />
          <IonItem
            color="dark"
            className="ion-margin-top"
            style={{
              borderRadius: "10px",
            }}
          >
            <IonInput
              type="text"
              placeholder="Aadhar no"
              label="Enter Aadhar card no"
              labelPlacement="floating"
              onIonInput={(e) => setaadharNo(e.detail.value!)}
            />
          </IonItem>
          {Cost && selectedPass && (
            <IonItem
              className="ion-margin-top"
              style={{
                borderRadius: "10px",
              }}
            >
              <IonLabel>
                <h4>Amout Payable</h4>
                <p>
                  Pass type: <strong>{selectedPass}</strong>
                </p>
              </IonLabel>
              <IonLabel slot="end">
                <h3>₹ {Cost}</h3>
              </IonLabel>
            </IonItem>
          )}

          <IonButton
            className="ion-margin-top"
            expand="block"
            size="large"
            onClick={handlePayment}
          >
            Pay Now
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default DailyPass;
