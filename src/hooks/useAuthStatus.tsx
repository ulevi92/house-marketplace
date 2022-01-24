import { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthStatus = () => {
  const auth = getAuth();

  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const mount = useRef(true);

  useEffect(() => {
    if (mount.current) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(true);
        }

        setCheckingStatus(false);
      });
    }

    return () => {
      mount.current = false;
    };
  }, [auth]);

  return { loggedIn, checkingStatus };
};
