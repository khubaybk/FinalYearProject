import React from "react";

import'./PostList.css'
import Card from "../../shared/components/UIElements/Card";
import PostItem from "./PostItem";
import Button from "../../shared/components/FormElements/Button";

const PostList = props => {
if(props.items.length === 0 ){
    return (<div className="place-list center">
        <Card>
            <h2>No Places found</h2>
            <Button to='/places/new'>Share Place</Button>
        </Card>
        
    </div>);
}

return <ul className="place-list">
    <br/>
    <br/>

    {props.items.map(place => <PostItem key={place.id} id={place.id} image={place.image} title={place.title} description={place.description} address={place.address} creatorID={place.creator} coordinates={place.location} onDelete={props.onDeletePlace} likedBy={place.likes}/>)}
</ul>
};

export default PostList;