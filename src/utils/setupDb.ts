import {
  addDoc,
  collection,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, fireStore } from "../services/firebaseClient";

const buses = [
  {
    busNumber: "KA-01-1234",

    capacity: 40,
    farePerKm: 2.5,
  },
  {
    busNumber: "KA-02-5678",

    capacity: 50,
    farePerKm: 3.0,
  },
  {
    busNumber: "KA-03-9101",

    capacity: 45,
    farePerKm: 2.8,
  },
  {
    busNumber: "KA-04-1122",

    capacity: 60,
    farePerKm: 3.5,
  },
  {
    busNumber: "KA-05-3344",

    capacity: 55,
    farePerKm: 2.7,
  },
];

// 🔹 Function to add buses to Firestore
const addBusesToFirestore = async () => {
  const busCollection = collection(fireStore, "buses");

  try {
    for (const bus of buses) {
      await addDoc(busCollection, bus);
      console.log(`Added bus: ${bus.busNumber}`);
    }
    console.log("All buses added successfully!");
  } catch (error) {
    console.error("Error adding buses:", error);
  }
};

const routes = [
  {
    id: "route_001",
    busNumber: "KA-01-1234",
    startLocation: "Mumbai",
    endLocation: "Pune",
    stops: [
      { name: "Thane", lat: 19.2183, lng: 72.9781, distanceFromStart: 30 },
      { name: "Lonavala", lat: 18.7543, lng: 73.406, distanceFromStart: 80 },
    ],
    totalDistance: 150,
    farePerKm: 2,
    baseFare: 50,
    // timestamp:"timestamp in iso format",
    // stopNames:[<array of stopnames from stops array>]
  },
  {
    id: "route_002",
    busNumber: "KA-01-1234",
    startLocation: "Delhi",
    endLocation: "Chandigarh",
    stops: [
      { name: "Panipat", lat: 29.3909, lng: 76.9635, distanceFromStart: 90 },
      { name: "Ambala", lat: 30.3782, lng: 76.7767, distanceFromStart: 190 },
    ],
    totalDistance: 250,
    farePerKm: 2.5,
    baseFare: 60,
  },
  {
    id: "route_003",
    busNumber: "KA-02-5678",
    startLocation: "Bangalore",
    endLocation: "Mysore",
    stops: [
      { name: "Ramanagara", lat: 12.7214, lng: 77.2814, distanceFromStart: 50 },
      { name: "Mandya", lat: 12.5242, lng: 76.8955, distanceFromStart: 100 },
    ],
    totalDistance: 150,
    farePerKm: 1.8,
    baseFare: 45,
  },
  {
    id: "route_004",
    busNumber: "KA-02-5678",
    startLocation: "Hyderabad",
    endLocation: "Vijayawada",
    stops: [
      { name: "Nalgonda", lat: 17.0575, lng: 79.2674, distanceFromStart: 100 },
      { name: "Guntur", lat: 16.3067, lng: 80.4365, distanceFromStart: 200 },
    ],
    totalDistance: 300,
    farePerKm: 2.2,
    baseFare: 70,
  },
  {
    id: "route_005",
    busNumber: "KA-03-9101",
    startLocation: "Chennai",
    endLocation: "Coimbatore",
    stops: [
      { name: "Vellore", lat: 12.9165, lng: 79.1325, distanceFromStart: 140 },
      { name: "Salem", lat: 11.6643, lng: 78.146, distanceFromStart: 300 },
    ],
    totalDistance: 400,
    farePerKm: 2.5,
    baseFare: 80,
  },
  {
    id: "route_006",
    busNumber: "KA-03-9101",
    startLocation: "Kolkata",
    endLocation: "Durgapur",
    stops: [
      { name: "Bardhaman", lat: 23.2324, lng: 87.8635, distanceFromStart: 100 },
      { name: "Asansol", lat: 23.6739, lng: 86.9524, distanceFromStart: 200 },
    ],
    totalDistance: 250,
    farePerKm: 2,
    baseFare: 55,
  },
  {
    id: "route_007",
    busNumber: "KA-04-1122",
    startLocation: "Ahmedabad",
    endLocation: "Surat",
    stops: [
      { name: "Vadodara", lat: 22.3072, lng: 73.1812, distanceFromStart: 120 },
      { name: "Bharuch", lat: 21.7051, lng: 72.9959, distanceFromStart: 200 },
    ],
    totalDistance: 270,
    farePerKm: 2.1,
    baseFare: 65,
  },
  {
    id: "route_008",
    busNumber: "KA-04-1122",
    startLocation: "Jaipur",
    endLocation: "Udaipur",
    stops: [
      { name: "Ajmer", lat: 26.4499, lng: 74.6399, distanceFromStart: 140 },
      {
        name: "Chittorgarh",
        lat: 24.8887,
        lng: 74.6269,
        distanceFromStart: 300,
      },
    ],
    totalDistance: 400,
    farePerKm: 2.3,
    baseFare: 75,
  },
  {
    id: "route_009",
    busNumber: "KA-05-3344",
    startLocation: "Lucknow",
    endLocation: "Varanasi",
    stops: [
      { name: "Faizabad", lat: 26.7755, lng: 82.1425, distanceFromStart: 120 },
      { name: "Prayagraj", lat: 25.4358, lng: 81.8463, distanceFromStart: 200 },
    ],
    totalDistance: 300,
    farePerKm: 2.4,
    baseFare: 70,
  },
  {
    id: "route_010",
    busNumber: "KA-05-3344",
    startLocation: "Pune",
    endLocation: "Goa",
    stops: [
      { name: "Satara", lat: 17.6805, lng: 74.0183, distanceFromStart: 100 },
      { name: "Belgaum", lat: 15.8497, lng: 74.4977, distanceFromStart: 250 },
    ],
    totalDistance: 400,
    farePerKm: 2.6,
    baseFare: 85,
  },
];

// 🔹 Function to add routes to Firestore
const addRoutesToFirestore = async () => {
  const routeCollection = collection(fireStore, "routes");

  try {
    for (const route of routes) {
      await addDoc(routeCollection, route);
      console.log(`Added route: ${route.id}`);
    }
    console.log("All routes added successfully!");
  } catch (error) {
    console.error("Error adding routes:", error);
  }
};
const cities = [
  // { city: "Mumbai" },
  // { city: "Pune" },
  // { city: "Delhi" },
  // { city: "Chandigarh" },
  // { city: "Bangalore" },
  // { city: "Mysore" },
  // { city: "Hyderabad" },
  // { city: "Vijayawada" },
  // { city: "Chennai" },
  // { city: "Coimbatore" },
  // { city: "Kolkata" },
  // { city: "Durgapur" },
  // { city: "Ahmedabad" },
  // { city: "Surat" },
  // { city: "Jaipur" },
  // { city: "Udaipur" },
  // { city: "Lucknow" },
  // { city: "Varanasi" },
  // { city: "Goa" },
  // { city: "Thane" },
  // { city: "Lonavala" },
  // { city: "Panipat" },
  // { city: "Ambala" },
  // { city: "Ramanagara" },
  // { city: "Mandya" },
  // { city: "Nalgonda" },
  // { city: "Guntur" },
  // { city: "Vellore" },
  // { city: "Salem" },
  // { city: "Bardhaman" },
  // { city: "Asansol" },
  // { city: "Vadodara" },
  // { city: "Bharuch" },
  // { city: "Ajmer" },
  // { city: "Chittorgarh" },
  // { city: "Faizabad" },
  // { city: "Prayagraj" },
  // { city: "Satara" },
  // { city: "Belgaum" },

  { city: "Hadapsar Gadital" },
  { city: "Swargate" },
  { city: "Ma Na Pa" },
  { city: "Pune Station" },
  { city: "Katraj" },
  { city: "Shivajinagar" },
  { city: "Deccan" },
  { city: "Marketyard" },
  { city: "Pimple Gurav" },
  { city: "Wagholi" },
  { city: "Baner" },
];

const addCitiesToFirestore = async () => {
  const cityCollection = collection(fireStore, "cities");

  try {
    for (const city of cities) {
      await addDoc(cityCollection, city);
      console.log(`Added city: ${city.city}`);
    }
    console.log("All cities added successfully!");
  } catch (error) {
    console.error("Error adding cities:", error);
  }
};
const updateRoutesFormat = async () => {
  const routesCollection = collection(fireStore, "routes");

  try {
    const querySnapshot = await getDocs(routesCollection);

    const updates = querySnapshot.docs.map(async (document) => {
      const data = document.data();

      // Ensure 'stops' exists and is an array
      if (!data.stops || !Array.isArray(data.stops)) {
        console.warn(
          `Skipping route ${document.id}: stops field is missing or invalid`
        );
        return;
      }

      // Extract stop names
      const stopNames = data.stops.map((stop: any) => stop.name);

      // Construct updated data
      const updatedData = {
        ...data,
        stopNames, // Add new field
      };

      // Update document in Firestore
      await updateDoc(doc(fireStore, "routes", document.id), updatedData);
      console.log(`Updated route ${document.id} successfully.`);
    });

    await Promise.all(updates); // Wait for all updates to complete
    console.log("All routes updated successfully.");
  } catch (error) {
    console.error("Error updating routes:", error);
  }
};
const updateRoutesWithTimestamp = async () => {
  console.log("updating routes with timestamp");

  const routesCollection = collection(fireStore, "routes");

  try {
    const querySnapshot = await getDocs(routesCollection);

    const updates = querySnapshot.docs.map(async (document) => {
      const data = document.data();

      // Add a timestamp field
      const updatedData = {
        ...data,
        timestamp: Timestamp.now(), // Firestore server timestamp
      };

      // Update document in Firestore
      await updateDoc(doc(fireStore, "routes", document.id), updatedData);
      console.log(`Updated route ${document.id} with timestamp.`);
    });

    await Promise.all(updates);
    console.log("All routes updated successfully.");
  } catch (error) {
    console.error("Error updating routes:", error);
  }
};

const stops = [
  { name: "Hadapsar Gadital", lat: 18.5089, lng: 73.9259 },
  { name: "Swargate", lat: 18.5018, lng: 73.8636 },
  { name: "Ma Na Pa", lat: 18.5196, lng: 73.8553 },
  { name: "Pune Station", lat: 18.5287, lng: 73.8746 },
  { name: "Katraj", lat: 18.4467, lng: 73.8651 },
  { name: "Shivajinagar", lat: 18.5309, lng: 73.8475 },
  { name: "Deccan", lat: 18.5167, lng: 73.8418 },
  { name: "Marketyard", lat: 18.4783, lng: 73.8775 },
  { name: "Pimple Gurav", lat: 18.5985, lng: 73.8228 },
  { name: "Wagholi", lat: 18.5806, lng: 73.9855 },
  { name: "Baner", lat: 18.559, lng: 73.7862 },
];

const farePerKm = 1.79;
const baseFare = 20;

function getRandomBusNumber() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `MH-12-${num}`;
}

// Approximate km between each stop
const approxDistancePerStop = 5;

const addRouteCombinations = async () => {
  const db = fireStore;
  const routesRef = collection(db, "routes");

  let routeCounter = 1;

  for (let i = 0; i < stops.length - 3; i++) {
    for (let j = i + 3; j < stops.length; j++) {
      const start = stops[i];
      const end = stops[j];
      const viaStops = stops.slice(i + 1, j);

      const allStops = [start, ...viaStops, end].map((stop, index) => ({
        ...stop,
        distanceFromStart: index * approxDistancePerStop,
      }));

      const totalDistance = (allStops.length - 1) * approxDistancePerStop;

      const route = {
        id: `route_${routeCounter.toString().padStart(3, "0")}`,
        busNumber: getRandomBusNumber(),
        startLocation: start.name,
        endLocation: end.name,
        stops: allStops,
        totalDistance,
        farePerKm,
        baseFare,
        timestamp: Timestamp.now(),
        stopNames: allStops.map((s) => s.name),
      };

      try {
        await addDoc(routesRef, route);
        console.log(`Route added: ${route.id} - ${start.name} to ${end.name}`);
        routeCounter++;
      } catch (error) {
        console.error("Error adding route:", error);
      }
    }
  }
};
const updateRouteTimestamps = async () => {
  const db = fireStore;
  const routesRef = collection(db, "routes");

  try {
    const snapshot = await getDocs(routesRef);

    const updatePromises = snapshot.docs.map((routeDoc) => {
      const docRef = doc(db, "routes", routeDoc.id);
      return updateDoc(docRef, {
        timestamp: Timestamp.now(),
      });
    });

    await Promise.all(updatePromises);
    console.log("All route documents updated with Firebase Timestamp.");
  } catch (error) {
    console.error("Error updating route timestamps:", error);
  }
};

export {
  addRoutesToFirestore,
  addBusesToFirestore,
  addCitiesToFirestore,
  updateRoutesFormat,
  updateRoutesWithTimestamp,
  addRouteCombinations,
  updateRouteTimestamps
};
