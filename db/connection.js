const mongoose = require('mongoose'); 

mongoose.connect(process.env.DB_CONNECT,{ 
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(()=>console.log('DB Connected'))
.catch(err=>console.log('DB Connection error',err))

