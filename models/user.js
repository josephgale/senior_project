const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

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
        required: true,
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
    teaching: {
        
    },
    enrolled: {
        type: String        
    }
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
module.exports = User