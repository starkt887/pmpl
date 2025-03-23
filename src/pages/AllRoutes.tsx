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
import {
  arrowDown,
  arrowUp,
  bus,
  chevronBack,
  chevronForward,
  ellipsisVerticalOutline,
  gitCommitOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ITicket } from "../components/PaymentDetails";
import { DateTime } from "../utils/luxon";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireStore } from "../services/firebaseClient";
import { useAppSelector } from "../app/hooks";
import { IBusData } from "./BuyTickets";
import BusDataModal from "../components/BusDataModal";

const AllRoutes = () => {
  const history = useHistory();
  const [allRoutes, setAllRoutes] = useState<IBusData[]>();
  const uid = useAppSelector((state) => state.AuthenticationState.uid);
  const [busData, setbusData] = useState<IBusData>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const getMyTickets = async () => {
    const q = query(collection(fireStore, "routes"));
    const querySnapshot = await getDocs(q);
    const routes = querySnapshot.docs.map((ticket) => {
      return ticket.data() as IBusData;
    });
    setAllRoutes(routes);
  };
  useEffect(() => {
    getMyTickets();
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

          <IonText className="app-title">Route Timetable</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonList>
          {allRoutes &&
            allRoutes.map((route, id) => {
              return (
                <IonItem
                  key={id}
                  onClick={() => {
                    setbusData(route);
                    setIsOpen(true);
                  }}
                >
                  <IonIcon size="large" src={bus} className="ion-padding-end" />

                  <IonLabel>
                    <h3>
                      {route.startLocation} - {route.endLocation}
                    </h3>
                    {`${DateTime.fromJSDate(route.timestamp.toDate()).toFormat(
                      "MMMM dd, yyyy hh:mm"
                    )}`}
                  </IonLabel>
                  <IonLabel slot="end">
                    <h4>₹ {route.baseFare}</h4>
                  </IonLabel>
                </IonItem>
              );
            })}
        </IonList>
        <BusDataModal isOpen={isOpen} setIsOpen={setIsOpen} busData={busData} />
      </IonContent>
    </IonPage>
  );
};

export default AllRoutes;
