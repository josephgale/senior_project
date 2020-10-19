const mongoose = require('mongoose');
//create user schema

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        max: 32
    },
    email:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    hashed_pw: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'student'
    },
    resetPasswordLink:{
        data: String,
        default: ''
    },
    salt: String,
},{timestamps: true});

//export user model 