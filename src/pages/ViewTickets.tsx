import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { bus, chevronBack, chevronForward } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ITicket } from "../components/PaymentDetails";
import { DateTime } from "../utils/luxon";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { fireStore } from "../services/firebaseClient";
import { useAppSelector } from "../app/hooks";
import useData from "../hooks/useData.hook";

const ViewTickets = () => {
  const history = useHistory();
  const [myTickets, setmyTickets] = useState<ITicket[]>();
  const { getMyTickets } = useData();

  const getTickets = async () => {
    const tickets = await getMyTickets();
    setmyTickets(tickets);
  };
  useEffect(() => {
    getTickets();
  }, []);

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

          <IonText className="app-title">My Tickets</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonList>
          {myTickets &&
            myTickets.map((ticket, id) => {
              return (
                <IonItem key={id}>
                  <IonIcon size="large" src={bus} className="ion-padding-end" />

                  <IonLabel>
                    <h3>
                      {ticket.source} - {ticket.destination}
                    </h3>
                    {`${DateTime.fromJSDate(ticket.timestamp.toDate()).toFormat(
                      "MMMM dd, yyyy hh:mm"
                    )}`}
                  </IonLabel>
                  <IonLabel slot="end">
                    <h4>₹ {ticket.cost}</h4>
                  </IonLabel>
                </IonItem>
              );
            })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ViewTickets;
