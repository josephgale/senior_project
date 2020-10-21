const express = require('express');
const router = express.Router();

router.post('/signup',(req,res,next)=>{
    if(1<2){
        next();
    }
},(req,res)=>{
    console.log(req);
    res.send("You made it")
})