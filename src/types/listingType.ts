export type FormDataType = {
  type: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  address: string;
  offer: boolean;
  regularPrice: number;
  discountedPrice?: number;
  images: any;
  latitude: number;
  longitude: number;
  userRef: string;
  location?: string;
  geolocation?: {
    lat: number;
    lng: number;
  };
  imageUrls?: string[];
};

export type ListingStateType = {
  geolocationEnabled: boolean;
  loading: boolean;
  formData: FormDataType;
};

type GeometryType = {
  location: {
    lat: number;
    lng: number;
  };
};

type GeolocationType = {
  formatted_address: string;
  geometry: GeometryType;
  place_id: string;
};

export type GetGeolocationDataType = {
  results: GeolocationType[];
  status: string;
};
