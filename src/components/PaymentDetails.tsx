import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  alertCircle,
  arrowBack,
  arrowDown,
  arrowForward,
  arrowUp,
  bus,
  ellipsisVerticalCircleOutline,
  ellipsisVerticalOutline,
  gitCommitOutline,
  listCircle,
  stopCircle,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { IBusData } from "../pages/BuyTickets";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import useToast from "../hooks/useToast.hook";
import { useAppSelector } from "../app/hooks";

export type PaymentType = {
  isOpen?: boolean;
  setIsOpen?: (state: boolean) => void;
  busData: IBusData | undefined;
  source: string;
  destination: string;
};

const PaymentDetails = ({
  isOpen,
  setIsOpen,
  busData,
  source,
  destination,
}: PaymentType) => {
  const [Cost, setCost] = useState<number>();

  const { error, isLoading, Razorpay: rzpay } = useRazorpay();
  const { presentToast } = useToast();
  const uid = useAppSelector((state) => state.AuthenticationState.uid);

  const getCost = () => {
    if (busData) {
      const basefare = busData.baseFare;
      let distanceFromStart = 0;
      if (destination === busData.endLocation) {
        distanceFromStart = busData.totalDistance;
      } else {
        distanceFromStart =
          busData.stops.find((stop) => destination === stop.name)
            ?.distanceFromStart || 0;
      }
      const finalCost = Math.round(
        basefare + busData.farePerKm * distanceFromStart
      );
      setCost(finalCost);
      return finalCost;
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
          name: "Test Company",
          description: "Test Transaction",
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
                alert("Payment Successful!");
                const ticketCollectionPayload = {
                  id: uid,
                  source,
                  destination,
                  cost: Cost,
                  ...verificationPayload,
                };
                presentToast("Ticket Purchase success!", "success");
                if (setIsOpen) setIsOpen(false);
              } else {
                throw new Error("Payment verification failed!");
              }
            } catch (error) {
              console.error("Payment error:", error);
              alert("Payment failed! Please try again.");
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

  const pushTicketDetails = () => {
    console.log("add ticket");
    
  };
  return (
    <IonModal isOpen={isOpen} onDidPresent={getCost}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Purchase Ticket</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsOpen && setIsOpen(false)}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {busData && (
            <IonItem
              color="tertiary"
              key={busData.id}
              style={{
                borderRadius: "10px",
              }}
            >
              <IonIcon size="large" src={bus} className="ion-padding-end" />

              <IonLabel>
                <h5>
                  {busData.startLocation} - {busData.endLocation}
                </h5>
                {`${new Date().toDateString()} ${new Date().getHours()}:${new Date().getMinutes()}`}
              </IonLabel>
            </IonItem>
          )}

          <IonItem
            color="secondary"
            className="ion-margin-top"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <IonIcon size="large" src={arrowDown} className="ion-padding-end" />
            <IonLabel class="ion-no-margin">
              <h3>Journey starts</h3>
            </IonLabel>
          </IonItem>
          {busData && (
            <>
              {source === busData.startLocation ? (
                <IonItem>
                  <IonIcon
                    size="large"
                    src={gitCommitOutline}
                    className="ion-padding-end"
                  />{" "}
                  <strong> {source}</strong>
                  <strong slot="end">(From)</strong>
                </IonItem>
              ) : (
                <IonItem>
                  <IonIcon
                    size="large"
                    src={ellipsisVerticalOutline}
                    className="ion-padding-end"
                  />{" "}
                  <p> {busData.startLocation}</p>
                </IonItem>
              )}
              <span style={{}}>
                {busData &&
                  busData.stopNames.map((stop: any, id: number) => {
                    if (stop === source)
                      return (
                        <IonItem key={id}>
                          <IonIcon
                            size="large"
                            src={gitCommitOutline}
                            className="ion-padding-end"
                          />{" "}
                          <strong>{stop}</strong>
                          <strong slot="end">(From)</strong>
                        </IonItem>
                      );
                    else if (stop === destination)
                      return (
                        <IonItem key={id}>
                          <IonIcon
                            size="large"
                            src={gitCommitOutline}
                            className="ion-padding-end"
                          />{" "}
                          <strong> {stop} </strong>
                          <strong slot="end">(To)</strong>
                        </IonItem>
                      );
                    return (
                      <IonItem key={id}>
                        <IonIcon
                          size="large"
                          src={ellipsisVerticalOutline}
                          className="ion-padding-end"
                        />{" "}
                        <p> {stop}</p>
                      </IonItem>
                    );
                  })}
              </span>
              {destination === busData.endLocation ? (
                <IonItem>
                  <IonIcon
                    size="large"
                    src={gitCommitOutline}
                    className="ion-padding-end"
                  />{" "}
                  <strong> {destination}</strong>
                  <strong slot="end">(To)</strong>
                </IonItem>
              ) : (
                <IonItem>
                  <IonIcon
                    size="large"
                    src={ellipsisVerticalOutline}
                    className="ion-padding-end"
                  />{" "}
                  <p> {busData.endLocation}</p>
                </IonItem>
              )}
            </>
          )}

          <br />
          <IonItem
            color="secondary"
            className="ion-margin-top"
            style={{
              borderBottomLeftRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            <IonIcon size="large" src={arrowUp} className="ion-padding-end" />
            <IonLabel class="ion-no-margin">
              <h3>Journey ends</h3>
            </IonLabel>
          </IonItem>
          <IonButton
            className="ion-margin-top"
            expand="block"
            size="large"
            onClick={handlePayment}
          >
            Purchase Ticket (₹{Cost})
          </IonButton>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default PaymentDetails;
