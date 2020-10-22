const express = require('express');
const router = express.Router();
const User = require('../models/user')

//create  user
router.post('/users',async (req,res)=>{    
    const user = new User(req.body);    
    
    try{
        await user.save();
        const token = await user.generateAuthToken();
        console.log('made it this far');
        res.status(200).send({user,token});
    }catch(e){
        res.status(400).send(e)
    }

    // User.save().then(()=>{
    //     res.status(200).send(user)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
}); 

//login & authenticate user
router.post('/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user){
            res.status(404).send("Fool!")
        }
        const token = await user.generateAuthToken();
        res.send({user,token})
    }catch(e){
        res.status(400).send("Pitty the fool")
    }
});

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