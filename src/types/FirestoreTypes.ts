type GeoLocationType = {
  _lat: number;
  _long: number;
  latitude: number;
  longitude: number;
};

export type ListingsDataType = {
  bathrooms: number;
  bedrooms: number;
  discountedPrice: number;
  furnished: boolean;
  geolocation: GeoLocationType;
  imageUrls: string[];
  location: string;
  name: string;
  offer: boolean;
  parking: boolean;
  regularPrice: number;
  timestamp: { seconds: number; nanoseconds: number };
  type: string;
  userRef: string;
};

export interface ListingsData {
  id: string;
  data: ListingsDataType;
}
