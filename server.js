const authRoutes = require('./routes/auth')
const express = require('express');
const path = require('path');

require('dotenv').config();
require('./db/connection');

const User = require('./models/user')
const Lesson = require('./models/lesson')

const app = express();
 
//production code when deployed to Heroku
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'client/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'client/build','index.html'))
        })
    }

//practice crud functionality for db: 
app.use(express.json())

/* ***** Create ***** */
app.post('/users',(req,res)=>{    
    const user = new User(req.body); 
    user.save().then(()=>{
        res.send(user)
        console.log('user sent back')
    }).catch((e)=>{
        res.status(400).send(e)
    });
}); 

app.post('/lessons',(req,res)=>{
    const lesson = new Lesson(req.body);
    lesson.save().then(()=>{
        res.send(lesson)
    }).catch((e)=>{
        res.status(400).send(e)
    });
    
});

/* ***** Read ***** */  

app.get('/users',(req,res)=>{
    User.find({}).then(
        res.send(User)
    ).catch((e)=>{res.status(400).send(e)})
});

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`Server running on port ${port}`));