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
  IonSearchbar,
  IonText,
  IonToolbar,
} from "@ionic/react";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  arrowForward,
  bus,
  chevronBack,
  chevronForward,
  search,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { fireStore } from "../services/firebaseClient";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addCities } from "../features/cities/citiesSlice";
import PaymentDetails, { PaymentType } from "../components/PaymentDetails";
import { DateTime } from "../utils/luxon";



export interface IBusData {
  baseFare: number;
  busNumber: string;
  endLocation: string;
  farePerKm: number;
  id: string;
  startLocation: string;
  stopNames: string[];
  stops: {
    distanceFromStart: number;
    lat: number;
    lng: number;
    name: string;
  }[];
  totalDistance: number;
  time:Timestamp
}
const BuyTickets = () => {
  const history = useHistory();
  const [source, setsource] = useState("");
  const [destination, setdestination] = useState("");
  const dispatch = useAppDispatch();
  const cities = useAppSelector((state) => state.CitiesState.cities);
  const [AvailableBuses, setAvailableBuses] = useState<IBusData[]>();
  const [searchResult, setsearchResult] = useState<{
    type: string;
    result: string[];
  }>();
  const [paymentDetails, setpaymentDetails] = useState<PaymentType>();
  const [isOpen, setIsOpen] = useState(false);
  const getCities = async () => {
    const q = query(collection(fireStore, "cities"));
    const querySnapshot = await getDocs(q);
    let cities: string[] = [];
    cities = querySnapshot.docs.map((snap) => {
      // console.log(snap.get("city"));
      cities.push(snap.get("city"));
      return snap.get("city");
    });
    console.log(cities);
    dispatch(addCities(cities));
  };

  useEffect(() => {
    getCities();
  }, []);

  const searchCities = (key: string, type: string) => {
    const matchingCities = cities.filter((city) =>
      city.toLowerCase().startsWith(key)
    );
    setsearchResult({ type, result: matchingCities });
  };
  const handleSourceChange = (key: string) => {
    console.log("handlesource");
    setAvailableBuses([]);
    setsource(key);
    if (key) {
      searchCities(key, "source");
      return;
    }
    console.log("clearing source");

    setsearchResult(undefined);
  };
  const handleDestinationChange = (key: string) => {
    console.log("handledestination");
    setAvailableBuses([]);
    setdestination(key);
    if (key) {
      searchCities(key, "destination");
      return;
    }
    setsearchResult(undefined);
  };
  useEffect(() => {
    console.log(searchResult);
  }, [searchResult]);

  const renderSearchResults = () => {
    return (
      <IonList>
        {searchResult &&
          searchResult.result.map((city) => {
            return (
              <IonItem
                key={city}
                onClick={() => {
                  if (searchResult.type === "source") {
                    setsource(city);
                    setsearchResult(undefined);
                  } else {
                    setdestination(city);
                    setsearchResult(undefined);
                  }
                }}
              >
                <IonLabel>{city}</IonLabel>
              </IonItem>
            );
          })}
      </IonList>
    );
  };

  const searchBuses = async () => {
    console.log("Searching buses");
    const q1 = query(
      collection(fireStore, "routes"),
      where("startLocation", "==", source),
      where("endLocation", "==", destination)
    );

    const routesPrimary = (await getDocs(q1)).docs.map((route) => {
      console.log(route.data());
      return route.data() as IBusData;
    });

    const q2 = query(
      collection(fireStore, "routes"),
      where("startLocation", "==", source),
      where("stopNames", "array-contains", destination)
    );

    const routesSecondary = (await getDocs(q2)).docs.map((route) => {
      console.log(route.data());
      return route.data() as IBusData;
    });

    const q3 = query(
      collection(fireStore, "routes"),
      where("stopNames", "array-contains", source),
      where("endLocation", "==", destination)
    );

    const routesTertiary = (await getDocs(q3)).docs.map((route) => {
      console.log(route.data());
      return route.data() as IBusData;
    });

    setAvailableBuses([
      ...routesPrimary,
      ...routesSecondary,
      ...routesTertiary,
    ]);
  };

  useEffect(() => {
    console.log("values changed", source, destination);
  }, [source, destination]);

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

          <IonText className="app-title">Buy Tickets</IonText>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonLabel>
          <p>Select source:</p>
        </IonLabel>
        <IonSearchbar
          showClearButton="focus"
          placeholder="Enter source"
          onIonInput={(e) => handleSourceChange(e.detail.value!)}
          debounce={500}
          value={source}
        ></IonSearchbar>
        {searchResult &&
          searchResult.type === "source" &&
          searchResult.result.length > 0 &&
          renderSearchResults()}

        <IonLabel>
          <p>Select destination:</p>
        </IonLabel>
        <IonSearchbar
          showClearButton="focus"
          placeholder="Enter destination"
          onIonInput={(e) => handleDestinationChange(e.detail.value!)}
          debounce={500}
          value={destination}
        ></IonSearchbar>
        {searchResult &&
          searchResult.type === "destination" &&
          searchResult.result.length > 0 &&
          renderSearchResults()}
        <IonButton expand="block" onClick={searchBuses}>
          Search buses
        </IonButton>
        <IonList>
          {AvailableBuses &&
            AvailableBuses.map((busData) => {
              return (
                <IonItem
                  key={busData.id}
                  onClick={() => {
                    setpaymentDetails({
                      busData: busData,
                      destination: destination,
                      source: source,
                    });
                    setIsOpen(true);
                  }}
                >
                  <IonIcon size="large" src={bus} className="ion-padding-end" />

                  <IonLabel>
                    <h3>
                      {busData.startLocation} - {busData.endLocation}
                    </h3>
                   {`${DateTime.now().toFormat('MMMM dd, yyyy hh:mm')}`}
                  </IonLabel>
                  <IonIcon
                    slot="end"
                    src={chevronForward}
                    className="ion-padding-end"
                  />
                </IonItem>
              );
            })}
        </IonList>

        <PaymentDetails
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          busData={paymentDetails?.busData||undefined}
          destination={paymentDetails?.destination || ""}
          source={paymentDetails?.source || ""}
        />
      </IonContent>
    </IonPage>
  );
};

export default BuyTickets;
