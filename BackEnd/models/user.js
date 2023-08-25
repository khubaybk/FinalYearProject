const mongoose = require('mongoose');
const {m} = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name:{type:String, required: true},
    email :{type:String, required: true, unique: true, },
    password:{type:String, required: true, minLength: 5},
    image:{type:String, required: true},
    places: [{type:mongoose.Types.ObjectId, required: true, ref: 'Place'}],
    timeSpent: {type: Number , required: true, default: 0},
    lastLogin: {type: Date , required: true, default: new Date(new Date().getTime() + 1000 * 60 * 60)},    
});

module.exports = mongoose.model('User', userSchema);