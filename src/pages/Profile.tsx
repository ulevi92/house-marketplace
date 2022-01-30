import React, { useEffect, useRef, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

interface ProfileState {
  name: string | null;
  email: string | null;
}

const Profile = () => {
  const auth = getAuth();

  const navigate = useNavigate();

  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState<ProfileState>({
    name: auth.currentUser!.displayName,
    email: auth.currentUser!.email,
  });

  const { name, email } = formData;

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
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

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
      </main>
    </div>
  );
};

export default Profile;
