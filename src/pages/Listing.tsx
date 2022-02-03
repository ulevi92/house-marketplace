import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc, DocumentReference } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { FormDataType } from "../types/listingType";
import { ParamsType } from "../types/paramsType";
import { toast } from "react-toastify";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface ListingState {
  loading: boolean;
  listing: FormDataType | null;
  shareLinkCopied: boolean;
}

const Listing = () => {
  const [state, setState] = useState<ListingState>({
    loading: true,
    listing: null,
    shareLinkCopied: false,
  });

  const { loading, listing, shareLinkCopied } = state;

  const setShareLinkCopied = (condition: boolean) => {
    setState((prevState) => ({
      ...prevState,
      shareLinkCopied: condition,
    }));
  };

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams<ParamsType>();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(
        db,
        "listings",
        params.listingId!
      ) as DocumentReference<FormDataType>;
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setState((prevState) => ({
          ...prevState,
          listing: docSnap.data(),
          loading: false,
        }));
      }

      if (!docSnap.exists()) {
        toast.error(`The Listing you're trying to get to is not exists`);
        navigate("/");
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) return <Spinner />;

  const onCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 2000);
  };

  const renderImages = listing?.imageUrls!.map((url, index) => {
    return (
      <SwiperSlide key={index}>
        <div className='swiperSlideDiv'>
          <img src={url} alt='' className='swiperSlideImg' />
          <p className='swiperSlideText'>Image {index + 1}</p>
        </div>
      </SwiperSlide>
    );
  });

  return (
    <main>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        slidesPerView={1}
      >
        {renderImages}
      </Swiper>

      <div className='shareIconDiv' onClick={onCopyClick}>
        <img src={shareIcon} alt='share' />
      </div>
      {shareLinkCopied && <p className='linkCopied'>Link copied!</p>}

      <div className='listingDetails'>
        <p className='listingName'>
          {listing?.name} - ${" "}
          {listing?.offer
            ? listing.discountedPrice?.toLocaleString()
            : listing?.regularPrice.toLocaleString()}
        </p>

        <p className='listingLocation'>{listing?.location}</p>

        <p className='listingType'>
          For {listing?.type === "rent" ? "Rent" : "Sale"}
        </p>

        {listing?.offer && (
          <p className='discountPrice'>
            ${listing.regularPrice - listing.discountedPrice!} Discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing?.bedrooms! > 1
              ? `1 Bedroom`
              : `${listing?.bedrooms} Bedrooms`}
          </li>
          <li>
            {listing?.bathrooms! > 1
              ? `1 Bathroom`
              : `${listing?.bathrooms} Bathrooms`}
          </li>
          <li>{listing?.parking && `Parking Spot`}</li>
          <li>{listing?.furnished && `Furnished`}</li>
        </ul>

        <p className='listingLocationTitle'>{listing?.location}</p>

        <div className='leafletContainer'>
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing?.geolocation!.lat, listing?.geolocation!.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' />

            <Marker
              position={[listing?.geolocation!.lat, listing?.geolocation!.lng]}
            >
              <Popup>{listing?.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing?.userRef && (
          <Link
            to={`/contact/${listing?.userRef}?listingName=${listing?.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
