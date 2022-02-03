import React, { useEffect, useRef, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  CollectionReference,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import { FormDataType, GetListingType } from "../types/listingType";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

interface ProfileState {
  name: string | null;
  email: string | null;
  listings?: GetListingType[];
  loading: boolean;
}

const Profile = () => {
  const auth = getAuth();
  const isMounted = useRef(true);
  const navigate = useNavigate();

  const [changeDetails, setChangeDetails] = useState(false);

  const [state, setState] = useState<ProfileState>({
    name: auth.currentUser!.displayName,
    email: auth.currentUser!.email,
    loading: true,
  });

  const { loading, listings } = state;

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(
        db,
        "listings"
      ) as CollectionReference<FormDataType>;

      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser?.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      const listings: GetListingType[] = [];

      querySnap.forEach((doc) =>
        listings.push({
          id: doc.id,
          data: doc.data(),
        })
      );

      setState((prevState) => ({
        ...prevState,
        listings,
        loading: false,
      }));
    };

    if (isMounted.current) fetchUserListings();

    return () => {
      isMounted.current = false;
    };
  }, [auth.currentUser?.uid]);

  const { name, email } = state;

  const onLogOutClick = () => {
    auth.signOut();
    navigate("/");
  };

  const onChangeDetailsClick = () => {
    changeDetails && onSubmit();
    setChangeDetails(!changeDetails);
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser?.displayName !== name) {
        //update display name in FB
        await updateProfile(auth.currentUser!, { displayName: name });

        //update in FB
        const userRef = doc(db, "users", auth.currentUser!.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error(`Couldn't update profile`);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      await deleteDoc(doc(db, "listings", id));
      const updatedListings = listings?.filter((listing) => listing.id !== id);

      setState((prevState) => ({
        ...prevState,
        listings: updatedListings,
        loading: false,
      }));
      toast.success("successfuly deleted listing");
    }
  };

  const onEdit = (id: string) => navigate(`/edit-listing/${id}`);

  const renderListings = listings?.map(({ data, id }) => (
    <ListingItem
      key={id}
      listing={data}
      id={id}
      onDelete
      onDeleteClick={onDelete}
      onEdit
      onEditClick={onEdit}
    />
  ));

  if (loading) return <Spinner />;

  return (
    <div className='profile'>
      <header className='profileHeader'>
        <p className='pageHeader'>MyProfile</p>
        <button type='button' className='logOut' onClick={onLogOutClick}>
          Log Out
        </button>
      </header>

      <main>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p className='changePersonalDetails' onClick={onChangeDetailsClick}>
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className='profileCard'>
          <form>
            <input
              type='text'
              id='name'
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name!}
              onChange={onInputChange}
            />

            <input
              type='text'
              id='email'
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email!}
              onChange={onInputChange}
            />
          </form>
        </div>

        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>

        {listings!.length > 0 && (
          <>
            <p className='listingText'>Your Listings</p>

            <ul className='listingList'>{renderListings}</ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
