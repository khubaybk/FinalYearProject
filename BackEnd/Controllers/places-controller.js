const fs = require('fs');

const HttpError = require("../models/http-error");
const {validationResult} = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const Place = require("../models/place");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const getCoordsForAddress = require("../util/location");
const {add} = require("nodemon/lib/rules");



const getAllPlaces = async (req, res, next) => {
    let places;
    try {
        places = await Place.find({});
       // console.log(places);
    }
    catch (err){
        const error = new HttpError("Fetching places failed. Please try again later.", 500);
        return next(error);
    }

    if(!places || places.length === 0) {
        return next(new HttpError("No places found for all users", 404));
    }
    res.json({places: places.map(place => place.toObject({getters: true}))});
};

const getPlaceById = async (req, res, next) => {

    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    }

    catch (err){
        const error = new HttpError("Something went wrong. Could not finhgnd a place", 500);
        return next(error);
    }

    if(!place) {
        const error = new HttpError("No place found for the provided place id", 404);
        return next(error);
    }

    res.json({place: place.toObject({getters: true})});
};


const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({creator: userId});
    }
    catch (err){
        const error = new HttpError("Fetching places failed. Please try again later.", 500);
        return next(error);
    }

    if(!places || places.length === 0) {
        return next(new HttpError("No places found for the provided user id", 404));
    }
    res.json({places: places.map(place => place.toObject({getters: true}))});
};




const createPlace = async (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs passed. Please check your data.", 422));
    }

    const {title, description, address} = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    }
    catch (error){
        return next(error);
    }


    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator: req.userData.userId
    });

    let user;

    try {
        user = await User.findById(req.userData.userId);
    }
    catch (err){
        return next(new HttpError("Creating a place failed. Please try again. User not found",500))
    }

    if(!user) {
        return next(new HttpError("We could not find a user for the provided id", 404));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        user.places.push(createdPlace);
        await user.save({session: sess});
        sess.commitTransaction();

    }
    catch (err){
        const error = new HttpError("Creating place failed please try again.", 500);

        return next(error);
    }

    res.status(201).json({place: createdPlace});
};

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs passed. Please check your data.", 422));
    }

    const {title, description} = req.body;
    const placeId = req.params.pid;

    let place;

    try {
        place = await Place.findById(placeId);
    }
    catch (err){
        const error = new HttpError("Something went wrong. Could not update place.", 500);
        return next(error);
    }

    
    if(place.creator.toString() !== req.userData.userId){
        return next(new HttpError("Not allowed to edit post.", 401));

    }
    
    place.title = title;
    place.description = description;

    try {
        await place.save();
    }
    catch (err){
        const error = new HttpError("Something went wrong, could not update place", 500);
        return next(error);
    }

    res.status(200).json({place: place.toObject({getters: true})});
};





const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId).populate("creator");
    }
    catch (err){
        return next(new HttpError("Something went wrong. Could not delete place.", 500));
    }

    if(!place) {
        return next(new HttpError("Could not find place for this id", 404));
    }
    
    if(place.creator.id !== req.userData.userId){
        return next(new HttpError("Not allowed to delete post.", 401));

    }
    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({session: sess});
        place.creator.places.pull(place);
        await place.creator.save({session: sess});
        await sess.commitTransaction();
    }
    catch (err){
        return next(new HttpError("Something went wrong. Could not delete place for some reason.", 500));
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    });
    res.status(200).json({message: "Deleted Place."});
};

const likePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    const userId = req.userData.userId;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find post.", 500);
        return next(error);
    }

    if (!place) {
        const error = new HttpError("Could not find post for provided id.", 404);
        return next(error);
    }

    if (place.likes.includes(userId)) {
        const error = new HttpError("You already liked this post.", 422);
        return next(error);
    }

    place.likes.push(userId);

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError("Something went wrong, could not like post.", 500);
        return next(error);
    }

    res.status(201).json({ message: "Post liked successfully."});
};

const unlikePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    const userId = req.userData.userId;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not unlike post.',
            500
        );
        return next(error);
    }

    if (!place) {
        const error = new HttpError('Could not find post for provided id.', 404);
        return next(error);
    }

    if (!place.likes.includes(userId)) {
        const error = new HttpError('You have not liked this post.', 403);
        return next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        place.likes.pull(userId);
        await place.save({ session });
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not unlike post.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Post unliked!' });
};
exports.likePlace = likePlace;
exports.unlikePlace = unlikePlace;












exports.getAllPlaces = getAllPlaces;


exports.getPlaceById = getPlaceById;


exports.getPlacesByUserId = getPlacesByUserId;


exports.createPlace = createPlace;


exports.updatePlaceById = updatePlaceById;


exports.deletePlace = deletePlace;
