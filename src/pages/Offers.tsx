import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  CollectionReference,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

import { FormDataType, GetListingType } from "../components/types/listingType";

interface OffersState {
  listings: GetListingType[];
  loading: boolean;
  lastFetchedListing?: QueryDocumentSnapshot<FormDataType>;
  loadButtonShow: boolean;
}

const Offers = () => {
  const [state, setState] = useState<OffersState>({
    listings: [],
    loading: true,
    loadButtonShow: true,
  });

  const { listings, loading, loadButtonShow, lastFetchedListing } = state;

  const isMount = useRef(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(
          db,
          "listings"
        ) as CollectionReference<FormDataType>;

        // Create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // Execute query
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];

        let listings: GetListingType[] = [];

        querySnap.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });

        setState((prevState) => ({
          ...prevState,
          listings,
          loading: false,
          lastFetchedListing: lastVisible,
        }));
      } catch (error) {
        toast.error("Something Went Wront");
      }
    };
    if (isMount.current) fetchListings();

    return () => {
      isMount.current = false;
    };
  }, []);

  // Pagination / load more
  const onFetchMoreListings = async () => {
    try {
      // Get reference
      const listingsRef = collection(
        db,
        "listings"
      ) as CollectionReference<FormDataType>;

      // Create a query
      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      let listings: GetListingType[] = [];

      querySnap.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() });
      });

      setState((prevState) => ({
        ...prevState,
        listings: [...state.listings, ...listings],
        loading: false,
        lastFetchedListing: lastVisible,
      }));
    } catch (error) {
      toast.error("Something Went Wront");
    }
  };

  const renderListings = listings.map((listing) => (
    <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
  ));

  return (
    <div className='category'>
      <header>
        <p className='pageHeader'>Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='categoryListings'>{renderListings}</ul>
          </main>

          <br />
          <br />

          {loadButtonShow && lastFetchedListing! && (
            <p className='loadMore' onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};

export default Offers;
