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
import Razorpay from "razorpay";

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

  const { error, isLoading, Razorpay:rzpay } = useRazorpay();

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
  const handlePayment = async() => {
    var instance = new Razorpay({
      key_id: "rzp_test_NxAV4QBfEPwxiL",
      key_secret: "GeHc4198s9VWQFxjQcQpm3SD",
    });

   const response= await instance.orders.create({
      amount: 5000,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        key1: "value3",
        key2: "value2",
      },
    });

    const options: RazorpayOrderOptions = {
      key: "rzp_test_NxAV4QBfEPwxiL",
      amount: 5000, // Amount in paise
      currency: "INR",
      name: "Test Company",
      description: "Test Transaction",
      order_id: response.id, // Generate order_id on server
      handler: (response) => {
        console.log(response);
        alert("Payment Successful!");
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
