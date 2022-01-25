import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

import googleIcon from "../assets/svg/googleIcon.svg";

const OAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onGoogleClick = async () => {
    try {
      const auth = getAuth();

      //subscribe to google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //check for user
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      //if user doesn't exists, create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
      }

      navigate("/");
    } catch (error) {
      toast.error(`Couldn't authrize with Google`);
    }
  };

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === "/sign-in" ? "In" : "Up"} with</p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img src={googleIcon} alt='google icon' className='socialIconImg' />
      </button>
    </div>
  );
};

export default OAuth;
