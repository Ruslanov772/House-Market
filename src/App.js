import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Explore from "./pages/Explore.js";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NavBar from "./components/NavBar/NavBar";
import PrivateRoute from "./components/PrivateRouter/PrivateRoute";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listings from "./pages/Listings";
import Contact from "./pages/Contact";


const App = () => {
    return (
        <>
            {/*Header*/}
            <Router>
                <Routes>
                    <Route path='/' element={<Explore />} />
                    <Route path='/offers' element={<Offers />} />
                    <Route path='/category/:categoryName' element={<Category />} />
                    <Route path='/profile' element={<PrivateRoute />}>
                        <Route path='/profile' element={<Profile />} />
                    </Route>
                    <Route path='/sign-in' element={<SignIn />} />
                    <Route path='/sign-up' element={<SignUp />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/create-listing' element={<CreateListing/> } />
                    <Route
                        path='/category/:categoryName/:listingId'
                        element={<Listings />}
                    />
                    <Route path='/contact/:landlordId' element={<Contact/>}/>
                </Routes>
                {/* NavBar */}
                <NavBar/>
            </Router>
            <ToastContainer />
        </>
    )
}

export default App;


// rsc