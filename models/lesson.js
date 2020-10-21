const mongoose = require('mongoose')

const lessonSchema = mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    question:{
        type: String,
        trim: true,
        required: true

    },
    answer:{
        type: String,
        trim: true,
        required: true
    }
});



//export model with schema as argument
module.exports = mongoose.model('Lesson',lessonSchema)