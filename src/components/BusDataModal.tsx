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
import React from "react";
import { IBusData } from "../pages/BuyTickets";
import {
  arrowDown,
  arrowUp,
  bus,
  ellipsisVerticalOutline,
  gitCommitOutline,
} from "ionicons/icons";

type BusDataProps = {
  busData: IBusData | undefined;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
};

const BusDataModal = ({ isOpen, setIsOpen, busData }: BusDataProps) => {
  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Bus Details</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsOpen && setIsOpen(false)}>
              Close
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {busData && (
          <IonList>
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
                src={arrowDown}
                className="ion-padding-end"
              />
              <IonLabel class="ion-no-margin">
                <h3>Journey starts</h3>
              </IonLabel>
            </IonItem>
            {busData && (
              <>
                <IonItem>
                  <IonIcon
                    size="large"
                    src={gitCommitOutline}
                    className="ion-padding-end"
                  />{" "}
                  <p> {busData.startLocation}</p>
                </IonItem>

                <span style={{}}>
                  {busData.stopNames.map((stop: any, id: number) => {
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

                <IonItem>
                  <IonIcon
                    size="large"
                    src={gitCommitOutline}
                    className="ion-padding-end"
                  />{" "}
                  <p> {busData.endLocation}</p>
                </IonItem>
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
          </IonList>
        )}
      </IonContent>
    </IonModal>
  );
};

export default BusDataModal;
