import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { fireStore } from "../services/firebaseClient";
import { IDailyPass } from "../pages/DailyPass";
import { ITicket } from "../components/PaymentDetails";
import { useAppSelector } from "../app/hooks";

function useData() {
  const uid = useAppSelector((state) => state.AuthenticationState.uid);
  const getMyTickets = async () => {
    const q = query(collection(fireStore, "tickets"), where("id", "==", uid));
    const querySnapshot = await getDocs(q);
    const tickets = querySnapshot.docs.map((ticket) => {
      return ticket.data() as ITicket;
    });
    return tickets;
  };

  const getMyPasses = async () => {
    const q = query(
      collection(fireStore, "dailypasses"),
      where("id", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    const dailypasses = querySnapshot.docs.map((pass) => {
      return pass.data() as IDailyPass;
    });
    return dailypasses;
  };

  const getRecentTickets = async () => {
    const q = query(
      collection(fireStore, "tickets"),
      where("id", "==", uid),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const tickets = querySnapshot.docs.map((ticket) => {
      return ticket.data() as ITicket;
    });
    return tickets;
  };

  const getRecentPasses = async () => {
    const q = query(
      collection(fireStore, "dailypasses"),
      where("id", "==", uid),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const dailypasses = querySnapshot.docs.map((pass) => {
      return pass.data() as IDailyPass;
    });
    return dailypasses;
  };

  return { getMyTickets, getMyPasses, getRecentTickets, getRecentPasses };
}
export default useData;
