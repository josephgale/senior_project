import React, {useEffect, useState} from 'react';
import '../../App.css'
import {Row,Col} from 'react-bootstrap'
import {Form} from '../../styles';
import {Body} from './loginpagestyles'
import Layout from '../../components/layout'
import {Link, useHistory} from 'react-router-dom';
import Google from '../../components/googleAuth';
import axios from 'axios';
import {authenticate} from '../../validation/helpers'
require('dotenv').config();



const LoginPage =()=>{
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        error: ""
    })

    useEffect(()=>{
        console.log('Attempting to update state')
    },[values.error])

    const history = useHistory()

    const handleChange = (name) =>(event)=>{
        setValues({...values,[name]:event.target.value});
    }
    const submitHandler = (event) => {
        if(event){
            event.preventDefault()
            axios({
                method: 'POST',
                url: '/api/login',
                data: {
                    email:values.email,
                    password:values.password
                }
            })
            .then((res)=>{
                console.log('Login success', res)
                //set a cookie if user authenticated
                authenticate(res,()=>{
                    setValues({...values,name:'',email:'',password:''})
                    console.log(values)
                    //return <Redirect to="/signup"/>
                    history.push('/dashboard')
                })
            })
            .catch((res)=> 
                setValues(values=>({...values,error:"Please check email and password"})) )
        }
    }
    const loginForm = () => (
        <Form onSubmit={submitHandler} id="login-form">
            <div className="form-group">
                <label>Email</label>
                <input className="form-control" type="text" onChange={handleChange('email')}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password" onChange={handleChange('password')}></input>
                <p style={{color:"red"}}>{values.error? values.error: ''}</p>
            </div>
            <div className="form-group">
                <input type="submit" value="Login" />
      
            </div>
            <div>
                <p>Forgot password? <Link to={'/pwResetRequest'}>Click here</Link></p>
            </div>
        </Form>
    )

    return(
        <Layout>   
            <Body>
                    <Row className="login-row">
                        <Col>
                        <div id="login-form-div">
                            <p class='google-message'>Sign in with Google</p>
                            <Google /> 
                            <p>or</p>
                            {loginForm()} 
                        </div>
                        </Col>
                        <Col>
                        <div className="features-list-div">
                                <h1 className='h1mod-alt'>Features of this form:</h1>
                                <ul class='features-list'>
                                    <li>OAuth2 and Google API used for login (problems with Firefox) </li>
                                    <li>MongoDB schema created with Mongoose handles password decryption</li>
                                    <li>Upon login, local storage is set with a JSON web token as a session cookie and the user's email is stored as a separate key-value pair for requests to MongoDB </li>
                                </ul>
                            </div>  
                           
                        </Col>
                        
                    </Row>
                
            </Body>

        </Layout>
        
    )
}

export default LoginPage;