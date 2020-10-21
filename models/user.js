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
        
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }    
});

//export user model 
module.exports = mongoose.model('User',userSchema);