import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase.config";
import { toast } from "react-toastify";

interface FormState {
  email: string;
  password: string;
}

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  });

  const { email, password } = formData;

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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad User Credentials");
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

          <div className='signInBar'>
            <p className='signInText'>Sign In</p>

            <button className='signInButton'>
              <ArrowRightIcon fill='#fff' width={34} height={34} />
            </button>
          </div>
        </form>

        <Link to='/sign-up' className='registerLink'>
          Sign Up Instead
        </Link>
      </main>
    </div>
  );
};

export default SignIn;
