import React from 'react';
import {getAuth, updateProfile} from 'firebase/auth';
import {doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore';
import {Link, useNavigate} from "react-router-dom";
import {db} from "../firebase.config";
import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import homeIcon from '../assets/svg/homeIcon.svg';
import arrowRing from '../assets/svg/keyboardArrowRightIcon.svg';
import Spinner from "../components/Spinner/Spinner";
import ListingItem from "../components/ListingItem/ListingItem";


const Profile = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [changeDetails, setChangeDetails] = useState(false);
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });
    const {name, email} = formData;

    useEffect(() => {
        ;(async () => {
            const listingsRef = collection(db, 'listings');
            const q = query(listingsRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc'));

            const querySnap = await getDocs(q);

            let listings = [];

            querySnap.forEach((doc => {
                    return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            )
            setListings(listings)
            setLoading(false)
        })()
    }, [auth.currentUser.uid])

    const onDelete = async (listingId) => {
        if (window.confirm("Delete listings?")) {
            await deleteDoc(doc(db, 'listings', listingId))
            const updateListings = listings.filter(
                listing => listing.id !== listingId
            )
            setListings(updateListings)
            toast.success('Success Deleted')
        } else {
            alert("Вы нажали кнопку отмена")
        }


    }

    const onLogout = () => {
        auth.signOut();
        navigate('/');
    }

    const onChange = e => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name || auth.currentUser.email !== email) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                    email: email,
                })
            }
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                name,
                email
            })
        } catch (errors) {
            toast.error('Errors 404')
        }
    }

    return (
        <div className={'profile'}>
            <header className={'profileHeader'}>
                <p className={'pageHeader'}>My Profile</p>
                <button onClick={onLogout} className={'logOut'}>Logout</button>
            </header>
            <main>
                <div className={'profileDetailsHeader'}>
                    <p className={'profileDetailsText'}>Personal Details</p>
                    <p
                        onClick={() => {
                            changeDetails && onSubmit()
                            setChangeDetails(prevState => !prevState)
                        }}
                        className={'changePersonalDetails'}
                    >
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>
                <div className={'profileCard'}>
                    <form>
                        <input
                            onChange={onChange}
                            value={name}
                            disabled={!changeDetails}
                            id={'name'}
                            type={'text'}
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                        />
                        <input
                            onChange={onChange}
                            value={email}
                            disabled={!changeDetails}
                            id={'email'}
                            type={'email'}
                            className={!changeDetails ? 'profileName' : 'profileNameActive'}
                        />
                    </form>
                </div>
                <Link to='/create-listing' className={'createListing'}>
                    <img src={homeIcon} alt="homeIcon"/>
                    <p>Sell for rent your home</p>
                    <img src={arrowRing} alt="arrowRing"/>
                    <p></p>
                </Link>
                {!loading && listings?.length > 0 && (
                    <>
                        <p className={'listingText'}>Your Listings</p>
                        <ul className={'lisitingsList'}>
                            {listings.map((listing) => (
                                <ListingItem
                                    listing={listing.data}
                                    id={listing.id}
                                    onDelete={() => onDelete(listing.id)}
                                    key={listing.id} />

                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    );
};

export default Profile;