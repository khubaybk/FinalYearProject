import React, {useEffect, useState} from "react";
import PostList from "../components/PostList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const AllPosts = () => {
    const [loadedPlaces,setLoadedPlaces] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    
    useEffect(() => {
        const fetchAllPlaces = async () => {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/places/getAllPosts'
                );
                setLoadedPlaces(responseData.places);
            }
            catch (err){
                console.log(err);

            }
        };
        fetchAllPlaces();
    }, [sendRequest]);


    const placeDeleteHandler = deletePlaceId => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletePlaceId ));
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <div className="center">
                <LoadingSpinner/>
            </div>}
            {!isLoading && loadedPlaces && <PostList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
        </React.Fragment>
    );
};

export default AllPosts;
