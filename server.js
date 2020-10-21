const authRoutes = require('./routes/auth')
const express = require('express');
const path = require('path');

const User = require('./models/user')
require('dotenv').config();
require('./db/connection')
const {signup} = require('./controllers/auth')

const app = express();

//production code when deployed to Heroku
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'client/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'client/build','index.html'))
        })
    }
//app.use('/api',()=>{console.log("hello")},authRoutes);

app.use(express.json())
app.post('/users',(req,res)=>{
    
    const user = new User(req.body);
    // res.send("hello joe")
    // console.log(user)
    user.save().then(()=>{
        res.send(user)
        console.log('user sent back')
    }).catch((e)=>{
        res.status(400).send(e)
    });
}); 

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`Server running on port ${port}`));