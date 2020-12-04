const express = require('express');
const router = express.Router();
const User = require('../models/user')
//controllers
const {signup,activate,pwResetRequest,pwReset,googleLogin,login,newLesson,getLessons,updateLesson,deleteLesson,getEnrollmentOptions,enroll,getEnrolledLessons,getLessonById,nextQuestion,getEnrolledStudents,updateAccountInfo,deleteAccount} = require('../controllers/auth')

router.post('/signup',signup);
router.post('/activate',activate);
router.post('/pwResetRequest',pwResetRequest);
router.post('/pwReset',pwReset);
router.post('/google-login',googleLogin)
router.post('/login',login) 
router.post('/getLessons',getLessons)
router.post('/newLesson',newLesson)
router.post('/updateLesson',updateLesson)
router.post('/deleteLesson',deleteLesson)
router.post('/getEnrollmentOptions',getEnrollmentOptions)
router.post('/getEnrolledLessons',getEnrolledLessons)
router.post('/enroll',enroll)
router.post('/getLessonById',getLessonById)
router.post('/nextQuestion',nextQuestion)
router.post('/getEnrolledStudents',getEnrolledStudents)
router.post('/updateAccountInfo',updateAccountInfo)
router.post('/deleteAccount',deleteAccount)


//find user by email
router.post('/checkEmail', async (req,res)=>{
    try {
        const emailExists = await User.exists({email: req.body.email})
        if(!emailExists){
            res.status(200).json({emailFound: false})
        }else{
            res.status(200).json({emailFound: true})
        }
    }catch(e){
        res.status(400).json({error: "Connection failed"})
        
    }
})

//get all users
router.get('/users',async (req,res)=>{
    try{
        const users = await User.find({});
        res.status(200).send(users)
    } catch(e) {
        res.status(500).send("We had an error: ", e)
    }

    // User.find({}).then((users)=>{
    //         res.status(200).send(users)        
    //     }).catch((e)=>{   
    //         res.status(400).send() 
    // })
});

//get user by id
router.get('/users/:id',async (req,res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        if(!user){
            return res.status(400).send("No user found")
        }
        res.status(200).send(user)
    }catch(e){
        res.status(500).send("No user by that id")
    }
})

router.patch('/users/:id',async (req,res)=>{
    //this sends an error message if user tries to update something that doesn't exist
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName','lastName','email','password','role']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        //use this because mongoose bypasses userSchema.pre()
        const user = await User.findById(req.params.id)
        updates.forEach((update)=> user[update] = req.body[update])
        //const user = await User.findByIdAndUpdate(req.params.id,req.body,{ new:true, runValidators:true})
        await user.save()
        if(!user){
            return res.status(404).send("Couldn't find user!!!")
        }
        res.status(200).send(user)
    }catch(e){
        res.status(500).send(e)
    }
    // User.findByIdAndUpdate(_id,{email:"beebop"})
    // .then((result1)=>{
    //     return User.countDocuments({email:"none"}) 
    // })
    // .then((result2)=>{
    //     //console.log(result2.rows[0])
    //     res.status(200).send("Entries with no email: " + result2)   
    // })
    // .catch((e)=>{
    //     console.log(e)
    //     res.send("You had an error")  
    // })
})

//delete user by id
router.delete('/users/:id',async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send("user not found");
        }
        res.send(user)
    }catch(e){
        res.status(500).send();
    }
})

module.exports = router