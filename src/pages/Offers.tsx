import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  CollectionReference,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { ListingsData, ListingsDataType } from "../types/firestoreTypes";
import { ParamsType } from "../types/paramsType";

interface OffersState {
  listings: ListingsData[];
  loading: boolean;
}

const Offers = () => {
  const [state, setState] = useState<OffersState>({
    listings: [],
    loading: true,
  });

  const { listings, loading } = state;

  const params = useParams<ParamsType>();

  const mount = useRef(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(
          db,
          "listings"
        ) as CollectionReference<ListingsDataType>;

        // Create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // Execute query
        const querySnap = await getDocs(q);

        let listings: ListingsData[] = [];

        querySnap.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });

        setState((prevState) => ({ ...prevState, listings, loading: false }));
      } catch (error) {
        toast.error("Something Went Wront");
      }
    };

    if (mount.current) {
      fetchListings();
    }

    return () => {
      mount.current = false;
    };
  }, []);

  const onDeleteClick = (id: string, name: string) => {};

  const renderListings = listings.map((listing) => (
    <ListingItem
      key={listing.id}
      listing={listing.data}
      id={listing.id}
      onDeleteClick={onDeleteClick}
    />
  ));

  console.log(listings);

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <main>
          <ul className='categoryListings'>{renderListings}</ul>
        </main>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};

export default Offers;
