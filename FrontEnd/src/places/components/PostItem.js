import React, {useState, useContext} from "react";

import'./PostItem.css'
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {AuthContext} from "../../shared/context/auth-context";
import {useHttpClient} from "../../shared/hooks/http-hook";

const PostItem = props => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    
    const [showMap, setShowMap] = useState(false);
    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);
    
    const [isLiked, setIsLiked]  = useState(false);


    const [showDelete, setShowDelete] = useState(false);
    const openDeleteHandler = () => setShowDelete(true);
    const closeDeleteHandler = () => setShowDelete(false);
    const confirmDeleteHandler = async () => {
        setShowDelete(false);
      try {
         await sendRequest(`http://localhost:5000/api/places/${props.id}`, 'DELETE', null, {
             Authorization: 'Bearer ' + auth.token
         });
         props.onDelete(props.id);
      }  catch (err){
          
      }
    };

    const likeHandler = async () => {
        try {
            await sendRequest(`http://localhost:5000/api/places/${props.id}/like`, "POST", auth.userId, {Authorization: "Bearer " + auth.token})
        }
        catch (err) {
            console.log(err);
        }

        setIsLiked(true);
    };

    const unLikeHandler = async () => {
        try {
            await sendRequest(`http://localhost:5000/api/places/${props.id}/unlike`, "POST", auth.userId, {Authorization: "Bearer " + auth.token});
        }
        catch (err){
            console.log(err);
        }

        setIsLiked(false);
    };




return(
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Modal show={showMap} 
            onCancel={closeMapHandler} 
            header={props.address} 
            contentClass="place-item__modal-content" 
            footerClass="place-item__modal-actions" 
            footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
            <div className="map-container">
            <Map center={props.coordinates} zoom={16} />
            </div>
            </Modal>
            <Modal show={showDelete} onCancel={closeDeleteHandler} header="Are you sure you want to delete" contentClass="place-item__modal-content" footerClass="place-item__modal-actions" footer={
                <React.Fragment>
                <Button inverse onClick={closeDeleteHandler}>CLOSE</Button>
                <Button danger onClick={confirmDeleteHandler}>DELETE</Button>

                </React.Fragment>}>
                <div className="map-container">
                    <h2>Are you sure you want to delete? This can't be undone</h2>
                </div>
            </Modal>
                       
    <li className="place-item">
        <Card className="place-item__content">
            {isLoading && <LoadingSpinner asOverlay/>}

        <div className="place-item__info">
            <h2>{props.title}</h2>
            <br/>

            <div className="place-item__image">
                <img src={`http://localhost:5000/${props.image}`} alt={props.title}/>
            </div>
            <br/>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
        </div>
        <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>View On Map</Button>
            {auth.userId === props.creatorID &&(
                <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creatorID &&(
                <Button Danger onClick={openDeleteHandler}>Delete</Button>
            )}
            {auth.userId !== props.creatorID && !isLiked &&
                <Button Success onClick={likeHandler}>LIKE</Button>
            }
            {
                auth.userId !== props.creatorID && isLiked &&
                <Button unlike onClick={unLikeHandler}>UNLIKE</Button>
            }
        </div>
        </Card>
    </li>
        </React.Fragment>
)
};

export default PostItem;