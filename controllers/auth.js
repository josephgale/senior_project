const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const User = require('../models/user')
const Lesson = require('../models/user')
const {OAuth2Client} = require('google-auth-library')

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
 
exports.login = (req,res) =>{
    const email = req.body.email 
    //validate if email exists and return error if not
    User.findOne({email}).exec((err,user)=>{
        if(!user){
            console.log('No email found',req) 
            res.status(404).send('Please check email and password')
        }else{
            //create a token that will be later added to a cookie
            const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn: '7d'})
            const {_id,email,name,role} = user;
            console.log('Login credentials are valid') 
            res.status(200).send({
                token, 
                user: {_id,email,name,role}
            })
        }
    })
}

// exports.newLesson = (req,res) => {
//     console.log(req.body)
//     User.updateOne({email:req.body.email},{$push: {teaching:
//         {
//         lessonName: req.body.lessonName,
//         asset: req.body.asset,
//         question1: req.body.question1,
//         answer1:req.body.answer1,
//         question2: req.body.question2,
//         answer2:req.body.answer2,
//         question3:req.body.question3,
//         answer:req.body.answer3
//         }
//     }},(err,docs)=>{
//         if(err){
//             console.log('There was an error',err)
//             res.send('There was an error')
//         }else{
//             console.log('Updated docs',docs)
//             res.send('new lesson possibly added')
//         }
//     })

// }

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

// exports.updateLesson = (req,res)=>{
//    console.log('updateLessons was hit',req.body)
//    User.updateOne(
//        {email:req.body.email},
//        {$set:{"teaching.$[current].lessonName":req.body.lessonName}},
//        {arrayFilters: [{current:{lessonName:req.body.originalName}}]})
//        .exec((err,data)=>{
//         if (err){
//             console.log('There was an error:',err)
//             res.status(400).send('Something didnt go right')
//         }else{
//             console.log('Success, here is doc', data)
//             res.status(200).send('Things appear to have gone correctly')
//         }
//        })

//     console.log('original name: ', req.body)
//     User.updateOne(
//         {email:req.body.email},
//         {$pull: {"teaching.lessonName": req.body.originalName}},
//         {arrayFilters: [{"teaching.lessonName":req.body.originalName}]}
//     )
//     .exec((err,data)=>{
//                 if (err){
//                     console.log('There was an error:',err)
//                     res.status(400).send('Something didnt go right')
//                 }else{
//                     console.log('Success, here is doc', data)
//                     res.status(200).send('Things appear to have gone correctly')
//                 }
// })
// }