import React, { useEffect, useState } from "react";
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
  IonList,
  IonItem,
} from "@ionic/react";
import {
  ticketOutline,
  calendarOutline,
  mapOutline,
  trainOutline,
  atCircleSharp,
  person,
  bus,
} from "ionicons/icons";
import "./Home.css";
import { useHistory } from "react-router";
import useData from "../hooks/useData.hook";
import { ITicket } from "../components/PaymentDetails";
import { IDailyPass } from "./DailyPass";
import { DateTime } from "../utils/luxon";
import { showLocalNotifications } from "../utils/notification";
import { addCitiesToFirestore, addRouteCombinations, updateRouteTimestamps } from "../utils/setupDb";

const Home: React.FC = () => {
  const history = useHistory();
  const { getRecentPasses, getRecentTickets } = useData();
  const [recentTickets, setrecentTickets] = useState<ITicket[]>();
  const [recentPasses, setrecentPasses] = useState<IDailyPass[]>();

  const getRecentData = async () => {
    const tickets = await getRecentTickets();
    setrecentTickets(tickets);
    const passes = await getRecentPasses();
    setrecentPasses(passes);
    passes.forEach((pass) => {
      const timediff = Math.round(
        DateTime.now().diff(DateTime.fromMillis(pass.timestamp.toMillis()), [
          "days",
        ]).days
      );
      console.log(timediff);
      if (timediff > 1) {
        showLocalNotifications(
          `${pass.type} is expired`,
          `${pass.type} bought on ${DateTime.fromJSDate(
            pass.timestamp.toDate()
          ).toISO(DateTime.DATETIME_MED)} is expired`,
          `Bus Route helper`
        );
      }
    });
  };

  useEffect(() => {
    getRecentData();
  }, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton slot="icon-only" fill="solid">
              <IonIcon icon={atCircleSharp} />
            </IonButton>
          </IonButtons>

          <IonText className="app-title">Bus Route helper</IonText>
          <IonButtons slot="end">
            {/* <IonButton slot="icon-only" fill="solid">
              <IonIcon icon={person} />
            </IonButton> */}
            <IonButton
              slot="icon-only"
              fill="solid"
              routerLink="/profile"
              routerDirection="forward"
            >
              <IonIcon icon={person} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
      {/* <IonButton onClick={() => addRouteCombinations()}>Add route combinations</IonButton>
      <IonButton onClick={() => addCitiesToFirestore()}>Add cities</IonButton>
      <IonButton onClick={() => updateRouteTimestamps()}>Update Route Timestamps</IonButton> */}
        <IonSearchbar
          placeholder="Where to?"
          onClick={() => history.push("/buytickets")}
        />

        <IonGrid>
          <IonRow className="ticket-options">
            <IonCol>
              <IonButton
                fill="solid"
                routerLink="/buytickets"
                routerDirection="forward"
              >
                <IonIcon icon={ticketOutline} size="large" />
                <IonLabel>Bus Ticket</IonLabel>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                fill="solid"
                routerLink="/dailypass"
                routerDirection="forward"
              >
                <IonIcon icon={calendarOutline} size="large" />
                <IonLabel>Daily Pass</IonLabel>
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow className="additional-options">
            <IonCol size="4">
              <IonButton
                fill="solid"
                routerLink="/viewtickets"
                routerDirection="forward"
                expand="block"
              >
                <IonIcon icon={ticketOutline} size="large" />
              </IonButton>
            </IonCol>
            <IonCol size="4">
              <IonButton
                fill="solid"
                routerLink="/viewpass"
                routerDirection="forward"
                expand="block"
              >
                <IonIcon icon={calendarOutline} size="large" />
              </IonButton>
            </IonCol>
            <IonCol size="4">
              <IonButton
                fill="solid"
                routerLink="/allroutes"
                routerDirection="forward"
                expand="block"
              >
                <IonIcon icon={mapOutline} size="large" />
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
          </IonRow>
          <IonRow className="near-me-section">
            <IonCol>
              <IonText>
                <h3>Recent Tickets</h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonList>
            {recentTickets &&
              recentTickets.map((ticket, id) => {
                return (
                  <IonItem key={id}>
                    <IonIcon
                      size="large"
                      src={bus}
                      className="ion-padding-end"
                    />

                    <IonLabel>
                      <h3>
                        {ticket.source} - {ticket.destination}
                      </h3>
                      {`${DateTime.fromJSDate(
                        ticket.timestamp.toDate()
                      ).toFormat("MMMM dd, yyyy hh:mm")}`}
                    </IonLabel>
                    <IonLabel slot="end">
                      <h4>₹ {ticket.cost}</h4>
                    </IonLabel>
                  </IonItem>
                );
              })}
          </IonList>

          <IonRow className="near-me-section">
            <IonCol>
              <IonText>
                <h3>Recent Passes</h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonList>
            {recentPasses &&
              recentPasses.map((pass, id) => {
                return (
                  <IonItem key={id}>
                    <IonIcon
                      size="large"
                      src={bus}
                      className="ion-padding-end"
                    />

                    <IonLabel>
                      <h3>{pass.type}</h3>
                      {`${DateTime.fromJSDate(pass.timestamp.toDate()).toFormat(
                        "MMMM dd, yyyy hh:mm"
                      )}`}
                    </IonLabel>
                    <IonLabel slot="end">
                      <h4>₹ {pass.cost}</h4>
                    </IonLabel>
                  </IonItem>
                );
              })}
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
