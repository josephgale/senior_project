const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const User = require('../models/user')
const Lesson = require('../models/user')
const {OAuth2Client} = require('google-auth-library');
const { hasBrowserCrypto } = require('google-auth-library/build/src/crypto/crypto');
const ObjectId = require("mongodb").ObjectID

//send email link for account creation
exports.signup = async (req,res)=>{    
        const {firstName,lastName,name,email,password,role} = req.body;   
    
        //validate if email already exists 
        User.findOne({email}).exec((err,user)=>{
            if(user){
                return res.status(400).json({error:`${email} not available`})
            }
            //if no user exists, create token 
            const token = jwt.sign({firstName, lastName, name,email,password,role},process.env.JWT_ACCOUNT_ACTIVATION,{expiresIn: '10min'})

            //create email template
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `Account activation link`,
                html: `
                    <h1>Please use the following link to activate your account</h1>
                    <p>${process.env.LOCAL_URL}/activate/${token}</p>
                    <hr/>
                    <p>This email may contain sensitive information</p>
                    <p>${process.env.API_URL}</p>
                `
            }
            //send email to user
            try{
                sgMail.send(emailData)
                return res.status(200).json(`Email sent to ${email}`)
            }catch(e){
                return res.status(400).json('Email did not send',e)
            } 
        });
}

exports.activate = (req,res) => {
    //receive token from request
    const token = req.body.token
    const activateCode = process.env.JWT_ACCOUNT_ACTIVATION
    console.log('token:', req.body.token)
    
    //handle token
    if(token){
        //validate token
        jwt.verify(token,activateCode,(err,decoded)=>{
            if(err){
                console.log('Expired link or bad link. Sign up again')
                // return res.status(401).json({
                //     error: 'Expired link. Sign up again'
                // })
            }

            //decode token and save to database
            const {firstName,lastName,name,email,password,role} = jwt.decode(token)
            user = new User({firstName,lastName,name,email,password,role})
            user.save((err,user)=>{
                if(err){
                    console.log('activation account error')
                }else{
                    console.log('Success!! You signed up')
                }
            });
        });
    }else{
        console.log('The token is legit but something went very wrong')
    }
    res.send({'message':'successfully activated'})
   
}

exports.pwResetRequest = (req,res) => {
    //search for email in database
    const email = req.body.email
    User.findOne({email}).exec((err,user)=>{
        if(!user){
            res.status(200).send("If user exists, user has been notified")
        }else{
            //send token to email address
            const token = jwt.sign({email},process.env.JWT_ACCOUNT_ACTIVATION,{expiresIn: '10min'})
            
            //create email template
            const emailData = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: `Password Rest Link`,
                html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.LOCAL_URL}/pwReset/${token}</p>
                    <hr/>
                    <p>This email may contain sensitive information</p>
                    <p>${process.env.API_URL}</p>
                `
            }
            try{
                sgMail.send(emailData)
                return res.status(200).json(`Email sent to ${email}`)
            }catch(e){
                return res.status(400).json('Email did not send',e)
            } 
        }
    })
    

}
/* this function does the following: 
1. accepts a post request from pwresetpage
2. validates if token is still valid
3. adds updates user with a new hashed password

*/
exports.pwReset = (req,res)=>{
    const token = req.body.token
    const password = req.body.password
    const activateCode = process.env.JWT_ACCOUNT_ACTIVATION
    console.log('token:',req.body)

    //validate token and add password to database
    if(token){
        jwt.verify(token,activateCode,(err,decoded)=>{
            if(err){
                console.log('Expired link or bad link')
                return res.status(400).send("Link expired")
            }else{
                //if token validates, extract email
                const {email} = jwt.decode(token)
                console.log('Email from token:',email)

                //find user by email/update
                User.updateOne({email},{password},(err,docs)=>{ 
                    if(err){
                        console.log("There was an error updating: ", err)
                    }else{
                        return res.status(200).send("User password updated")
                    }
                });

                
            }

        })

    }
}
//account activation from client activation page

/*
This function does the following: 
1. uses the google-auth-library to instantiate a new OAuth2 client
2. Accepts/verifies a post request containing idToken from GoogleAuth component in React
3. Checks if user is in database and either adds or logs in user
4. 

* This function is called when authentication for google is routed to api/google-login
*/

//create a new client object 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req,res) => {
   //idToken originally provided by google in <Google />, but added to req.body on ajax call
   const {idToken} = req.body
   client.verifyIdToken({idToken,audience:process.env.GOOGLE_CLIENT_ID})
   .then(
       //verifyIdToken provides response object which needs to be different from googleLogin res
       (response) =>{    
            //destructure variables from payload
            const {email_verified,name,email} = response.payload
            if(email_verified){
                User.findOne({email}).exec((err,user)=>{
                    //return user if exists
                    if(user){
                        console.log('user was found')
                        //create a token (not the one from Google) for cookie
                        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn: '7d'})
                        const {_id,email,name,role} = user;
                        return res.json({
                            token, 
                            user: {_id,email,name,role}
                        })
                    } else {
                        console.log('user WAS NOT found')
                        //create new account if not exists
                        let password = email + process.env.JWT_SECRET
                        user = new User({name,email,password})
                        user.save((err,data)=>{
                            if(err){
                                console.log('ERROR GOOGLE LOGIN ON USER SAVE',err)
                                return res.status(400).json({error: "User sign up with Google failed"})
                            }
                            const token = jwt.sign({_id:data._id},process.env.JWT_SECRET,{expiresIn: '7d'})
                            const {_id,email,name,role} = user
                            return res.json({
                                token, 
                                user: {_id,email,name,role}
                            })
                        })
                    }
                })
            } else {
                return res.status(400).json({
                    error: "Google login failed. Try again"
                    })
                }
        }
    )
}
 
exports.login = async (req,res) =>{
    const email = req.body.email 
    const password = req.body.password

    //see if user is found
    try{
        const user = await User.findByCredentials(req.body.email,password) 

    }catch(e){
        res.status(404).send({"error":"user was not found"})
    }
    
    try{
        const user = await User.findByCredentials(req.body.email,password) 
        //create a token that will be later added to a cookie
            const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn: '7d'})
            const {_id,email,name,role} = user;
            console.log('Login credentials are valid') 
            res.status(200).send({
                token, 
                user: {_id,email,name,role}
            })
    }catch(e){
        console.log('There was an error ',e )
        res.status(404).send({"error":"user found but something else went wrong"})
    }

    //validate if email exists and return error if not
    // User.findOne({email}).exec((err,user)=>{
    //     if(!user){
    //         console.log('No email found',req) 
    //         res.status(404).send('Please check email and password')
    //     }else{
    //         //validate password
    //         User.findByCredentials(req.body.email,req.body.password)
    //         //create a token that will be later added to a cookie
    //         const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn: '7d'})
    //         const {_id,email,name,role} = user;
    //         console.log('Login credentials are valid') 
    //         res.status(200).send({
    //             token, 
    //             user: {_id,email,name,role}
    //         })
    //     }
    // })
}

exports.newLesson = async (req,res) => {
    
    User.updateOne(
        {email:req.body.email},
        {$push: {teaching:
                    [
                        {
                        lessonName: req.body.lessonName,
                        asset: req.body.asset,
                        question1: req.body.question1,
                        answer1:req.body.answer1,
                        question2: req.body.question2,
                        answer2:req.body.answer2,
                        question3:req.body.question3,
                        answer:req.body.answer3
                        }
                    ]
                }
        },
        (err,docs)=>{
            if(err){
                console.log('There was an error',err)
                res.send('There was an error')
            }else{
                console.log('Updated docs',docs)
                res.send(docs)
            }
        }
    )
    
}

exports.updateLesson = (req,res)=>{
    console.log('update Lesson hit. Here is req:',req.body)
    User.findOneAndUpdate(        
        { "email":req.body.email, "teaching.lessonName" : req.body.originalName},
        { $set: 
            {
            'teaching.$.lessonName': req.body.lessonName,
            'teaching.$.asset': req.body.asset,
            'teaching.$.question1': req.body.question1,
            'teaching.$.answer1':req.body.answer1,
            'teaching.$.question2': req.body.question2,
            'teaching.$.answer2':req.body.answer2,
            'teaching.$.question3':req.body.question3,
            'teaching.$.answer3': req.body.answer3
            }
        }
    )
    .exec((err,doc)=>{
        if(err){
            console.log('There was an error updating lesson',doc)
            return res.status(400).send(err)
        }else{
            console.log('Possible success in updating record')
            return res.status(200).send("Possible success")
        }
    })
        
}

exports.getLessons = (req,res)=>{
    console.log('getLessons was hit')
    User.findOne({email:req.body.email}).exec((err,user)=>{
        if(!user){
            console.log('No email found',req) 
            res.status(404).send('Please check email and password')
        }else{
            //returns an object containing teaching objects
            console.log(user)
            res.send({lessons: user.teaching})
        }
    })   
}

exports.deleteLesson = (req,res)=>{
    User.findOneAndUpdate(        
        { "email":req.body.email, "teaching.lessonName" : req.body.lessonName},
        { $pull: 
            {
                "teaching": {
                    "lessonName": req.body.lessonName
                }
            }
        }
    )
    .exec((err,doc)=>{
        if(err){
            console.log('There was an error deleting lesson',doc)
            return res.status(400).send(err)
        }else{
            console.log('Possible success in deleting record')
            return res.status(200).send("Possible success")
        }
    })

}
exports.getEnrollmentOptions = async(req,res) =>{
    //get all classes that user is already enrolled in
    const user = await User.find({email: req.body.email})
    //User.find returns an array with one object, map that object to create to array to filter all enrollments
    const enrolledArray = user[0].enrolled.map((each)=>each.lesson_id)    
    
    //find all users that are not current user
    const otherUsers = await User.find({email: {$ne:req.body.email}})
    
    //loop through result from otherUsers and create an array of objects with name -- lessonid -- lessonName
    let allClasses = []
    Object.values(otherUsers)
        .map(
            (user)=>Object.values(user.teaching)
            .map(
                (lesson)=>
                    {
                        
                        allClasses.push({'teacher':user.name,'lesson_id':lesson._id,'lessonName':lesson.lessonName})
                        
                    }
                )
            )
    
    //filter out options in which user is already enrolled
    let filteredArray = allClasses.filter
        (
            (each)=>
            {

                if(!enrolledArray.includes(each.lesson_id.toString()))
                    {
                        //console.log('returning', each)
                        return each
                    }
            }
        )

    res.send(filteredArray)

}

exports.getEnrolledLessons = async (req,res) => {
    console.log('getEnrolledLessons hit!')
    const user = await User.find({email: req.body.email})
    //User.find returns an array with one object, map that object to create to array to filter all enrollments
    const enrolledArray = user[0].enrolled.map((each)=>each) 
    res.send(enrolledArray)  

}
exports.enroll = (req,res) => {
    console.log('enroll hit', req.body)
    User.findOneAndUpdate(        
        { "email":req.body.email},
        {$push: 
            {enrolled:
                [
                    {
                    lesson_id: req.body.lesson_id,
                    teacher: req.body.teacher,
                    lessonName: req.body.lessonName,
                    completed:0,
                    score:0,
                    }
                ]
            }
        }   
    )
    .exec((err,doc)=>{
        if(err){
            console.log('There was an error enrolling in the lesson',doc)
            return res.status(400).send(err)
        }else{
            console.log('Possible success in enrolling in lesson')
            return res.status(200).send(doc)
        }
    })
}

exports.getLessonById = async (req,res) => {
    console.log('Here is the full request from getLessonById: ', req.body)

    await User.find(
        {'teaching._id': req.body.lessonId},
            {'teaching':
                {$elemMatch:{_id:req.body.lessonId} 
            } 
        },
        (err,post)=>
            {
                console.log('here is the retreived info:', post) 
                if(post.length<1){
                    console.log('The array is empty')
                    res.send(post)
                } else {
                    err?res.send('error!'):res.send(post[0].teaching[0])
                }
                
            }
    )

}

exports.nextQuestion = (req,res) => {
    console.log('next question function called: ', req.body) 
    //receive completed item, then mongodb update, then return next question and answer
    //res.send(user)  
    
    User.findOneAndUpdate(        
        { "email":req.body.email, "enrolled.lesson_id":req.body.lessonId},
        { $set: 
            {
            'enrolled.$.completed': req.body.completed,
            'enrolled.$.score': req.body.score
            }
        }
    )
    .exec((err,doc)=>
        {
            if(err){
                console.log('There was an error updating user enrolled lesson',doc)
                return res.status(400).send(err)
            }else{
                console.log('Possible success in updating enrolled lesson')
                return res.status(200).send("Possible success in updating enrolled lesson") 
            }
        }
    )
   
}

//this function returns all students and all their enrolled lessons for the requesting teacher; further filtering of non-teacher classes needed in client
exports.getEnrolledStudents = (req,res) =>{
    console.log('find students hit!!', req.body)  
    //res.send(req.body.user)
    User.find(
        //{"name": {$ne:req.body.user}},  
         //{"enrolled.teacher": req.body.user}, 
         {"enrolled":
            {
                $elemMatch:
                    {
                        teacher:req.body.teacher
                    }
            } 
        },
        //add projection object which filters results   
        {"name":1,"enrolled":1}      
        )
        .exec(
            (err,post)=>
                {
                    if(err){
                            res.send('Error finding students!')
                    }else{
                        console.log('enrolled student data: ', post)
                        res.send(post)
                    }
                }
        )

}
exports.updateAccountInfo = (req,res) => { 
    console.log('update account info req',req.body.id)
    User.findByIdAndUpdate(
        {_id:req.body.id},
        {name: req.body.name,email:req.body.email,password:req.body.password},
        {upsert: true}
    ).exec((err,post)=>err?res.send('Account information not updated'):res.send(post))
}

exports.deleteAccount = (req,res)=>{
    console.log('delete account function hit',req.body.id) 
    User.findByIdAndDelete( 
        {_id:req.body.id}
    ).exec((err,post)=>err?res.send('Account was not deleted'):res.send('account deleted')) 
} 

exports.deleteEnrollment = (req,res)=>{
    console.log('email: ', req.body.email)
    console.log('enrolled:',req.body.lesson_id)
    User.findOneAndUpdate(        
        { "email":req.body.email},
        { $pull: 
            {
                "enrolled": {
                    "lesson_id": req.body.lesson_id
                }
            }
        }
    )
    .exec((err,doc)=>{
        if(err){
            console.log('There was an error dropping lesson',doc)
            return res.status(400).send(err)
        }else{
            console.log('Possible success in dropping lesson')
            return res.status(200).send("Possible success dropping lesson")
        }
    })

}
