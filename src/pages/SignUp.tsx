import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { setDoc, doc, serverTimestamp, FieldValue } from "firebase/firestore";
import { db, firebaseConfig } from "../firebase.config";
import { toast } from "react-toastify";

interface FormState {
  name: string;
  email: string;
  password?: string;
  timeStamp?: FieldValue;
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));

  const onShowPasswordClick = () => setShowPassword(!showPassword);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      initializeApp(firebaseConfig);

      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password!
      );

      if (auth && auth.currentUser) {
        updateProfile(auth.currentUser, {
          displayName: name,
        });
      }

      const user = userCredential.user;

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with registration");
    }
  };

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Welcom Back!</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type='text'
            className='nameInput'
            placeholder='Name'
            id='name'
            value={name}
            onChange={onInputChange}
          />

          <input
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onInputChange}
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? "text" : "password"}
              className='passwordInput'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onInputChange}
            />

            <img
              src={visibilityIcon}
              alt='show password icon'
              className='showPassword'
              onClick={onShowPasswordClick}
            />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          </Link>

          <div className='signUpBar'>
            <p className='signUpText'>Sign Up</p>

            <button className='signUpButton'>
              <ArrowRightIcon fill='#fff' width={34} height={34} />
            </button>
          </div>
        </form>

        <Link to='/sign-in' className='registerLink'>
          Sign In Instead
        </Link>
      </main>
    </div>
  );
};

export default SignUp;
