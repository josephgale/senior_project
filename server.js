const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

//connect to db
mongoose.connect(process.env.DB_CONNECT,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(()=>console.log('DB Connected'))
.catch(err=>console.log('DB Connection error',err))

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'client/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'client/build','index.html'))
        })
    }

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`Server running on port ${port}`));