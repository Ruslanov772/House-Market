import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {collection, getDocs, query, where, orderBy, limit, startAfter} from "firebase/firestore";
import {db} from "../firebase.config";
import {toast} from "react-toastify";
import Spinner from "../components/Spinner/Spinner";
import ListingItem from "../components/ListingItem/ListingItem";


const Category = () => {
    const [fetchLastListing, setFetchListing] = useState(null);
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingRef = collection(db, 'listings');
                const q = query(listingRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )
                const querySnap = await getDocs(q);
                const lastVisiable = querySnap.docs[querySnap.docs.length - 1];
                setFetchListing(lastVisiable)
                const listings = [];
                querySnap.forEach(doc => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                })
                setListings(listings);
                setLoading(false)
            } catch (error) {
                toast.error('Errors 404')
            }
        }
        fetchListings()
    }, [params.categoryName])

    const onFetchMoreListings = async () => {
        try {
            const listingRef = collection(db, 'listings');
            const q = query(
                listingRef,
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(fetchLastListing),
                limit(3),
            )
            const querySnap = await getDocs(q);
            const lastVisiable = querySnap.docs[querySnap.docs.length - 1];
            setFetchListing(lastVisiable)
            const listings = [];
            querySnap.forEach(doc => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setListings(prevState => [...prevState, ...listings]);
            setLoading(false)
        } catch (error) {
            toast.error('Errors 404')
        }
    }

    return (
        <div className={'category'}>
            <header>
                <p className={'pageHeader'}>{params.categoryName.toUpperCase()}</p>
            </header>
            {loading ? (
                <Spinner/>
            ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className={'categoryListingName'}>
                            {listings.map(listing => (
                                <ListingItem
                                    listing={listing.data}
                                    id={listing.id}
                                    key={listing.id}
                                />
                            ))}
                        </ul>
                    </main>
                    {fetchLastListing && (
                        <p className={'loadMore'} onClick={onFetchMoreListings}>Load More</p>
                    )}
                </>
            ) : (
                <p>No listings for {params.categoryName}</p>
            )}
        </div>
    );
};

export default Category;