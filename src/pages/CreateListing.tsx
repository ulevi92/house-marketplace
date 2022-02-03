import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db, firebaseConfig } from "../firebase.config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../components/Spinner";
import { GetGeolocationDataType, ListingStateType } from "../types/listingType";
import { initializeApp } from "firebase/app";

const apiKey = process.env.REACT_APP_GOOGLE_API;

const CreateListing = () => {
  const [state, setState] = useState<ListingStateType>({
    geolocationEnabled: true,
    loading: true,
    formData: {
      type: "rent",
      name: "",
      bedrooms: 1,
      bathrooms: 1,
      parking: false,
      furnished: false,
      address: "",
      offer: false,
      regularPrice: 0,
      discountedPrice: 0,
      images: null,
      latitude: 0,
      longitude: 0,
      userRef: "",
    },
  });

  const isMounted = useRef(true);

  const navigate = useNavigate();
  const auth = getAuth();

  const { loading, formData, geolocationEnabled } = state;
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  useEffect(() => {
    if (isMounted.current) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setState((prevState) => ({
            ...prevState,
            formData: {
              ...formData,
              userRef: user.uid,
            },
            loading: false,
          }));
        }

        if (!user) navigate("/sign-in");
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [auth, formData, navigate]);

  const setLoading = (condition: boolean) => {
    setState((prevState) => ({
      ...prevState,
      loading: condition,
    }));
  };

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    let boolean: boolean | null = null;

    if (e.currentTarget.value === "false") boolean = false;
    if (e.currentTarget.value === "true") boolean = true;

    const formValue = e.currentTarget.id!;

    if (e.currentTarget.value === "true" || e.currentTarget.value === "false") {
      setState((prevState) => ({
        ...prevState,
        formData: {
          ...formData,
          [formValue]: boolean,
        },
      }));
    }

    if (e.currentTarget.value === "rent" || e.currentTarget.value === "sale") {
      const value = e.currentTarget.value!;

      setState((prevState) => ({
        ...prevState,
        formData: {
          ...formData,
          type: value,
        },
      }));
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setState((prevState) => ({
        ...prevState,
        formData: {
          ...formData,
          images: e.target.files,
        },
      }));
    }

    if (!e.target.files) {
      setState((prevState) => ({
        ...prevState,
        formData: {
          ...formData,
          [e.target.id]: e.target.value,
        },
      }));
    }
  };

  const onAdressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((prevState) => ({
      ...prevState,
      formData: {
        ...formData,
        address: e.target.value,
      },
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (discountedPrice! >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price must be less than regular price");
      return;
    }

    if (images!.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }
    let location: string | undefined;

    let geolocation = {
      lat: 0,
      lng: 0,
    };

    if (geolocationEnabled) {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
      );

      const data: GetGeolocationDataType = await res.json();

      geolocation.lat = data.results[0].geometry.location.lat ?? 0;
      geolocation.lng = data.results[0].geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESUILTS" ? undefined : address;
    }
    if (!geolocationEnabled) {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    if (location === undefined) {
      setLoading(false);
      toast.error("Please enter a correct address");
      return;
    }

    //store Images in Firebase

    const storeImage = async (image: any) => {
      initializeApp(firebaseConfig);
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser!.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    console.log(imageUrls);

    delete formDataCopy.images;

    location && (formDataCopy.location = location);

    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    setLoading(false);

    toast.success("Listing Saved!");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (loading) return <Spinner />;

  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id='type'
              value='sale'
              onClick={onButtonClick}
            >
              Sell
            </button>
            <button
              type='button'
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id='type'
              value='rent'
              onClick={onButtonClick}
            >
              Rent
            </button>
          </div>

          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onInputChange}
            maxLength={32}
            minLength={10}
            required
          />

          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onInputChange}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onInputChange}
                min='1'
                max='50'
                required
              />
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? "formButtonActive" : "formButton"}
              type='button'
              id='parking'
              value={"true"}
              onClick={onButtonClick}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              type='button'
              id='parking'
              value={"false"}
              onClick={onButtonClick}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? "formButtonActive" : "formButton"}
              type='button'
              id='furnished'
              value={"true"}
              onClick={onButtonClick}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type='button'
              id='furnished'
              value={"false"}
              onClick={onButtonClick}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            id='address'
            value={address}
            onChange={onAdressChange}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onInputChange}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onInputChange}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? "formButtonActive" : "formButton"}
              type='button'
              id='offer'
              value={"true"}
              onClick={onButtonClick}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              type='button'
              id='offer'
              value={"false"}
              onClick={onButtonClick}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onInputChange}
              min={50}
              max={750000000}
              required
            />
            {type === "rent" && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onInputChange}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onInputChange}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
