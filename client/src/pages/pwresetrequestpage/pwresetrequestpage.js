/*This page does the following: 
1. Provides a form to request a password reset
2. Validates user input for valid email address
3. Sends HTTP request to API
4. Confirms if API call is successful
*NOTE: The user will not be aware if email address exists or not
*/
import React, {useState} from 'react';
import '../../App.css'
import {Row,Col} from 'react-bootstrap'
import {Body} from './pwresetrequestpagestyles'
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
        <Form onSubmit={submitHandler} id="login-form">
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
            <Body>
                <Row className='login-row'>
                    <Col>
                        <div id="login-form-div">
                            <h1>Forgot your password?</h1>
                            <p>Type in your email and we will send a reset link</p>
                            {resetPasswordForm()}
                        </div>
                    </Col>
                    <Col>
                    <div className="features-list-div">
                                <h1 className='h1mod-alt'>Features of this form:</h1>
                                <ul class='features-list'>
                                    <li>Form validation happens after submission </li>
                                    <li>A link with JSON webtoken is sent to email address. Token has expiration of 10 minutes</li>
                                    </ul>
                            </div>  
                    </Col>
                </Row>
                <div>
                    
                </div>
            </Body>

        </Layout>
        
    )
}

export default PwResetRequest
