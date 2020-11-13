/* ***** IMPORTS ***** */
//Core 
const express = require('express');
const path = require('path');
require('dotenv').config();
var cors = require('cors')

//Database
require('./db/connection');

//Routing
const accountRoutes = require('./routes/accounts');
const lessonRoutes = require('./routes/lessons');

/* ***** START MAIN API ***** */ 
//Server setup and route specs
const app = express();

app.use(cors()); //allows for ajax calls to server from client
app.use(express.json());
app.use('/api',accountRoutes);
app.use('/api',lessonRoutes);


//Production specs for Heroku
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'client/build')));
    app.get('/',(req,res)=>{
        res.sendFile(path.join(__dirname,'client/build','index.html'))
        })
    }

const port = process.env.PORT || 8000;
app.listen(port,()=>console.log(`Server running on port ${port}`));