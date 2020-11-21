import React, {useState} from 'react';
import Layout from '../../components/layout'
import {Form} from '../../pages/signuppage/signup.styles'
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
        errors: {}
    })

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
            .catch((res)=>console.log("Please check username and password",res))
           

            
        }
    }
    const loginForm = () => (
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Email</label>
                <input className="form-control" type="text" onChange={handleChange('email')}/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password" onChange={handleChange('password')}></input>
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
            <Google />     
            {loginForm()}  
        </Layout>
        
    )
}

export default LoginPage;