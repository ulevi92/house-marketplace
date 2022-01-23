import { useNavigate, useLocation } from "react-router-dom";
import { navIcons } from "./Navbar.helper";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route: string) => {
    if (route === location.pathname) {
      return true;
    }
    return false;
  };

  const renderIcons = navIcons.map((icon) => (
    <li key={icon.id} className='navbarListItem'>
      <icon.element
        style={icon.style}
        onClick={() => navigate(icon.link)}
        fill={pathMatchRoute(icon.link) ? icon.fill : "#8f8f8f"}
      />
      <p
        className={
          pathMatchRoute(icon.link)
            ? "navbarListItemNameActive"
            : "navbarListItemName"
        }
      >
        {icon.p}
      </p>
    </li>
  ));

  return (
    <footer className='navbar'>
      <nav className='navbarNav'>
        <ul className='navbarListItems'>{renderIcons}</ul>
      </nav>
    </footer>
  );
};
export default Navbar;
