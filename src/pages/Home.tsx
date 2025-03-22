import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSearchbar,
  IonIcon,
  IonButton,
  IonLabel,
  IonText,
  IonButtons,
} from "@ionic/react";
import {
  ticketOutline,
  calendarOutline,
  mapOutline,
  trainOutline,
  atCircleSharp,
  person,
} from "ionicons/icons";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton slot="icon-only" fill="solid">
              <IonIcon icon={atCircleSharp} />
            </IonButton>
          </IonButtons>

          <IonText className="app-title">PMPL Route helper</IonText>
          <IonButtons slot="end">
            {/* <IonButton slot="icon-only" fill="solid">
              <IonIcon icon={person} />
            </IonButton> */}
            <IonButton slot="icon-only" fill="solid">
              <IonIcon icon={person} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar placeholder="Where to?" />

        <IonGrid>
          <IonRow className="ticket-options">
            <IonCol>
              <IonButton fill="solid" routerLink="/buytickets" routerDirection="forward">
                <IonIcon icon={ticketOutline} size="large" />
                <IonLabel>Bus Ticket</IonLabel>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton fill="solid">
                <IonIcon icon={calendarOutline} size="large" />
                <IonLabel>Daily Pass</IonLabel>
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow className="additional-options">
            <IonCol>
              <IonButton fill="solid">
                <IonIcon icon={ticketOutline} size="large" />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton fill="solid">
                <IonIcon icon={ticketOutline} size="large" />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton fill="solid">
                <IonIcon icon={mapOutline} size="large" />
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton fill="solid">
                <IonIcon icon={trainOutline} size="large" />
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="additional-options">
            <IonCol>
              <IonLabel>View Ticket</IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel>View Pass</IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel>Route Timetable</IonLabel>
            </IonCol>
            <IonCol>
              <IonLabel>Metro Ticket</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow className="near-me-section">
            <IonCol>
              <IonText>
                <h3>Near Me</h3>
              </IonText>
            </IonCol>
            <IonCol>
              <IonText className="ion-text-end">
                <h4>show all</h4>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow className="near-me-section">
            <IonCol>
              <IonText color="medium">Bus Stop</IonText>
            </IonCol>
            <IonCol>
              <IonText color="medium" className="ion-text-end">
                449m
              </IonText>
            </IonCol>
          </IonRow>
          <IonText>No upcoming buses at this stop.</IonText>
          <IonRow className="nearby-map">
            <IonCol size="12">
              <div className="map-placeholder">Map Placeholder</div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
