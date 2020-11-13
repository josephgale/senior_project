/*This page does the following: 
1. Provides a form to request a password reset
2. Validates user input for valid email address
3. Sends HTTP request to API
4. Confirms if API call is successful
*NOTE: The user will not be aware if email address exists or not
*/
import React, {useState} from 'react';
import {Form, Input} from '../signuppage/signup.styles'
import EmailValidator from 'email-validator';
import axios from 'axios';
import Layout from '../../components/layout';

const PwResetRequest = () => {
    //create state/hook for either errors or success message
    const [values,setValues] = useState({
        error: ""
    });

    //handle when user hits submit
    const submitHandler = (event) =>{
        if(event){
            event.preventDefault();
            
            //extract email from target and validate
            const emailAddress = event.target.email.value
            if(!EmailValidator.validate(emailAddress)){
                //use hook if email is invalid type of email address
                setValues({...values,error:"Invalid email address"})
            }else{
                //use hook to set message, then make API call
                setValues({...values,error:"",success:"If this email is registered, a reset password link has been sent"})
                
                //API handles tokenization and email to user
                axios({
                    method: 'post',
                    url: '/api/pwResetRequest',
                    data:{
                        email:emailAddress
                    }
                })
                .then(()=>(console.log('Submission successful')))
                
                //use hook to set error if API call failed
                .catch((e)=>setValues({...values,error:"Something went wrong, please try again"}))
                
             }
        }
    }

    //create form
    const resetPasswordForm = () => (
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Email address</label>
                <input name="email" className="form-control" type="text"></input>
                <p style={{color: "red"}}>{values.error?values.error:values.success?values.success:""}</p>
            </div>
            <div className="form-group">
                <Input className="btn-danger" type="submit" value="Submit" />
            </div>
        </Form>
    )
    return(
        <Layout>
            <div>
                <p>Enter your email address</p>
                {resetPasswordForm()}
            </div>
        </Layout>
        
    )
}

export default PwResetRequest
