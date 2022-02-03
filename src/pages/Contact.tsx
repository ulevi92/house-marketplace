import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ParamsListType } from "../components/types/paramsType";
import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { ContactType } from "../components/types/contactType";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

interface ContactState {
  message: string;
  landlord?: ContactType;
  loading: boolean;
}

const Contact = () => {
  const [state, setState] = useState<ContactState>({
    message: "",
    loading: true,
  });
  const [searchParams] = useSearchParams();

  const { message, loading, landlord } = state;

  const params = useParams<ParamsListType>();
  const navigate = useNavigate();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(
        db,
        "users",
        params.landlordId!
      ) as DocumentReference<ContactType>;
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setState((prevState) => ({
          ...prevState,
          landlord: docSnap.data(),
          loading: false,
        }));
      }

      if (!docSnap.exists()) {
        toast.error(`Couldn't get landlord Info`);

        setTimeout(() => navigate("/"), 2000);
      }
    };

    getLandlord();
  }, [navigate, params.landlordId]);

  const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((prevState) => ({
      ...prevState,
      message: e.target.value,
    }));
  };

  if (loading) return <Spinner />;

  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Contact Landlord</p>
      </header>

      {landlord && (
        <main>
          <div className='contactLandLord'>
            <p className='landlordName'>Contact {landlord.name}</p>
          </div>

          <form className='messageForm'>
            <div className='messageDiv'>
              <label htmlFor='message' className='messageLabel'>
                Message
              </label>

              <textarea
                name='message'
                id='message'
                className='textarea'
                value={message}
                onChange={onMessageChange}
              ></textarea>
            </div>

            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type='button' className='primaryButton'>
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
