const { v4: uuidv4 } = require('uuid');


const {validationResult} = require("express-validator");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");
const User = require('../models/user');



const getUsers = async (req, res, next) => {
    let users
    try {
       users = await User.find({}, '-password');
    }
    catch (err) {
        return next(new HttpError('fetch user flopped try l8r', 500));
    }
    res.json({users: users.map(user => user.toObject({getters: true}))})
    
};




const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next( new HttpError("Invalid inputs passed. Please check your data.", 422));
    }
    const {name, email, password} = req.body;

    let existingUser
    try {
        existingUser = await User.findOne({email: email});
    }
    catch (err){
        const error = new HttpError('sign up failed foo, try again l8r alig8r', 500);
        return next(error);
    }
    
    if(existingUser){
        const error = new HttpError('already exists, login instead foo', 422);
        return next(error);
    }
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12)
    }catch (err){
        const error = new HttpError('Could not create user, please try again.', 500);
        return next(error);
        
    }
    let createdUser =  new User ({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: [],
        timeSpent: 0,
        lastLogin: new Date(new Date().getTime() + 1000 * 60 * 60)
    });

    try {
        await createdUser.save();
    }
    catch (err){
        const error = new HttpError("Signing up failed please try again.", 500);
        return next(error);
    }
    let token;
    try{
        token = jwt.sign({userId: createdUser.id, email: createdUser.email, timeSpent: createdUser.timeSpent, lastLogin: createdUser.lastLogin,}, 'supersecret_dont_share', {expiresIn: '1h'});
    }
    catch (err) {
        const error = new HttpError("Signing up failed please try again.", 500);
        return next(error);
    }
    res.status(201).json({userId : createdUser.id, email: createdUser.email, timeSpent: createdUser.timeSpent, lastLogin: createdUser.lastLogin, token: token});
};




const login = async (req, res, next) => {
    const {email, password} = req.body;
    let existingUser
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError('Log in failed, try again.', 500);
        return next(error);
    }
    
    

    if(!existingUser){
        const error = new HttpError('Invalid details', 401);
        return next(error);    
    }
    let isValidPassword = false;
    
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);

    }
    catch (err){
        const error = new HttpError('Logging in failed. Please try again', 500);
        return next(error);
    }

    if(!isValidPassword) {
        const error = new HttpError('Invalid details', 401);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign({userId: existingUser.id, email: existingUser.email, timeSpent: existingUser.timeSpent, lastLogin: existingUser.lastLogin}, 'supersecret_dont_share', {expiresIn: '1h'})
    }
    catch (err) {
        const error = new HttpError("Logging in failed please try again.", 500);
        return next(error);
    }
    res.status(201);
    res.json({userId : existingUser.id, email: existingUser.email, timeSpent: existingUser.timeSpent, lastLogin: existingUser.lastLogin ,token: token});
};






const timeSpent = async (req, res, next) => {
    const {userId, timeSpent} = req.body;

    let existingUser;
try {
    existingUser = await User.findOne({_id: userId});
   // console.log("Existing user is " + existingUser);
   // console.log("userID in timeupdate is: " + userId);
    existingUser.timeSpent = req.body.timeSpent;
}catch (err){
    const error = new HttpError("Updating time failed please try again.", 500);
    return next(error);
}

        
        try {
            await existingUser.save();
        }catch(err){
            const error = new HttpError("Updating time failed please try again.", 500);
            return next(error);
        }

    res.status(201).json({timeSpent: timeSpent});


};


const updateLastLogin = async (req, res, next) => {
    const {userId, lastLogin} = req.body;


    let existingUser;
    try {
        existingUser = await User.findOne({_id: userId});
        existingUser.lastLogin = req.body.lastLogin;
    }catch (err){
        const error = new HttpError("Updating loginTime failed please try again.", 500);
        console.log(error);
        
        return next(error);
    }


    try {
        await existingUser.save();
    }catch(err){
        const error = new HttpError("Updating loginTime failed please try again.", 500);
        console.log(err);
        return next(error);
    }

    res.status(201).json({lastLogin: lastLogin});


};



exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.timeSpent = timeSpent;
exports.updateLastLogin = updateLastLogin;