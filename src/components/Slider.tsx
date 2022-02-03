import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  CollectionReference,
} from "firebase/firestore";
import { db, firebaseConfig } from "../firebase.config";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FormDataType, GetListingType } from "./types/listingType";
import { initializeApp } from "firebase/app";
import Spinner from "./Spinner";

interface SliderState {
  loading: boolean;
  listings?: GetListingType[];
}

const Slider = () => {
  const [state, setState] = useState<SliderState>({
    loading: true,
  });

  const { loading, listings } = state;

  const navigate = useNavigate();

  useEffect(() => {
    const getListing = async () => {
      initializeApp(firebaseConfig);

      const listingRef = collection(
        db,
        "listings"
      ) as CollectionReference<FormDataType>;
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));

      const querySnap = await getDocs(q);

      let listing: GetListingType[] = [];

      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setState((prevState) => ({
        ...prevState,
        loading: false,
        listings: listing,
      }));
    };

    getListing();
  }, []);

  const renderSliders = listings?.map(({ data, id }) => (
    <SwiperSlide
      key={id}
      onClick={() => navigate(`/category/${data.type}/${id}`)}
    >
      <div className='swiperSlideDiv'>
        <img
          src={data.imageUrls![0]}
          alt=''
          className='swiperSlideImg'
          onContextMenu={() => false}
        />
        <p className='swiperSlideText'>{data.name}</p>
        <p className='swiperSlidePrice'>
          $ {data.discountedPrice ?? data.regularPrice}{" "}
          {data.type === "rent" && "/ month"}
        </p>
      </div>
    </SwiperSlide>
  ));

  if (loading) return <Spinner />;

  if (listings?.length === 0) return <></>;

  return (
    <>
      <p className='exploreHeading'>Recommended</p>

      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        slidesPerView={1}
      >
        {renderSliders}
      </Swiper>
    </>
  );
};

export default Slider;
