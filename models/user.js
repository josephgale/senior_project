const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const lessonSchema = mongoose.Schema({
    lessonName:{
        type: String
    },
    asset:{
        type: String
    },
    question1:{
        type: String
    },
    answer1:{
        type: String
    },
    question2:{
        type: String
    },
    answer2:{
        type: String
    },
    question3:{
        type: String
    },
    answer3:{
        type: String
    },
    score:{
        type: Number
    },
    completion:{
        type: Number
    }

});


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: false,
        max: 32
    },
    lastName: {
        type: String,
        trim: true,
        required: false,
        max: 32
    },
    name:{ 
        type: String,
        required: false,
        max: 64
    },
    email:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        index: {
            unique:true
        }
        
    },
    password: {
        type: String,
        required: true
    },
    teaching: [lessonSchema],
    
    enrolled: [lessonSchema]
});
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'secret')

    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

//login user
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    
    const isMatch = await bcrypt.compare(password,user.password)
    
    if(!isMatch){
        throw new Error('Unable to login')
    }
    
    return user
}

//Hash password before saving: NOTICE: This doesn't work for findByIdAndUpdate, just user.save()
userSchema.pre('save', async function (next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

const User = mongoose.model('User',userSchema)
const Lesson = mongoose.model('Lesson',lessonSchema)


module.exports = User,Lesson

