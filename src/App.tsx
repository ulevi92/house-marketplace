import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/layouts/Navbar";
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";
import NotFound from "./pages/404";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Explore />} />
        <Route path='/category/:categoryName' element={<Category />} />
        <Route path='/offers' element={<Offers />} />
        <Route path='/profile' element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/create-listing' element={<CreateListing />} />/
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route
          path='/category/:categoryName/:listingId'
          element={<Listing />}
        />
        <Route path='/contact/:landlordId' element={<Contact />} />
        <Route path='/edit-listing/:listingId' element={<EditListing />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>

      <Navbar />

      <ToastContainer autoClose={2500} hideProgressBar={true} />
    </Router>
  );
}

export default App;
