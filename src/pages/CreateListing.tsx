import { useState } from "react";

type ListingStateType = {
  geoLocationEnable: boolean;
  loading: boolean;
  listing: {};
};

const CreateListing = () => {
  const [state, setState] = useState<ListingStateType>({
    geoLocationEnable: true,
    loading: true,
    listing: {},
  });

  return <></>;
};

export default CreateListing;
