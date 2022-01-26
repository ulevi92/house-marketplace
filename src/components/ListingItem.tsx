import { FC } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import { ListingsDataType } from "../types/FirestoreTypes";

interface ListingItemProps {
  listing: ListingsDataType;
  id: string;
  onDeleteClick: (id: string, name: string) => void;
  onDelete?: boolean;
}

const ListingItem: FC<ListingItemProps> = ({
  listing,
  id,
  onDeleteClick,
  onDelete,
}) => {
  return (
    <li className='categoryListing'>
      <Link
        to={`category/${listing!.type}/${id}`}
        className='categoryListingLink'
      >
        <img
          src={listing.imageUrls[1]}
          alt={listing.name}
          className='categoryListingImg'
        />
        <div className='categoryListingDetails'>
          <p className='categoryListingLocation'>{listing.location}</p>

          <p className='categoryListingName'>{listing.name}</p>

          <p className='categoryListingPrice'>
            $
            {listing.offer
              ? listing.discountedPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}{" "}
            {listing.type === "rent" && "/ month"}
          </p>

          <div className='categoryListingInfoDiv'>
            <img src={bedIcon} alt='bed' />
            <p className='categoryListingInfoText'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : `1 Bedroom`}
            </p>

            <img src={bathtubIcon} alt='bath' />
            <p className='categoryListingInfoText'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : `1 bathroom`}
            </p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <DeleteIcon
          className='removeIcon'
          fill='rgb(231,76,60)'
          onClick={() => onDeleteClick}
        />
      )}
    </li>
  );
};

export default ListingItem;