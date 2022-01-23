import { ReactComponent as OfferIcon } from "../../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../../assets/svg/personOutlineIcon.svg";

type navbarIconsType = {
  id: number;
  element: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  style: {
    width: string;
    height: string;
  };
  p: string;
  link: string;
  fill: string;
};

export const navIcons: navbarIconsType[] = [
  {
    id: 0,
    element: OfferIcon,
    fill: "#2c2c2c",
    style: {
      width: "36px",
      height: "36px",
    },
    p: "Explore",
    link: "/",
  },
  {
    id: 1,
    element: ExploreIcon,
    fill: "#2c2c2c",
    style: {
      width: "36px",
      height: "36px",
    },
    p: "Offer",
    link: "/offers",
  },
  {
    id: 2,
    element: PersonOutlineIcon,
    fill: "#2c2c2c",
    style: {
      width: "36px",
      height: "36px",
    },
    p: "Profile",
    link: "/profile",
  },
];
