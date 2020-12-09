import React from 'react';
import {Form} from '../styles'
import '../App.css'
import {useHistory} from 'react-router-dom'
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import {setCookie,setLocalStorage} from '../validation/helpers'
require('dotenv').config();

//const dotenv = require('dotenv')
// import dotenv from 'dotenv';
// dotenv.config()

const Google = () => {
    const history = useHistory()
    const responseGoogle = (res) =>{
        console.log(res);
        axios({
            method: 'POST',
            url: 'api/google-login',
            data: {idToken: res.tokenId}
        })
        .then(res=>{
            console.log('Google signin success', res.data.token)
            //set cookie/local storage here
            setCookie('token',res.data.token)
            setLocalStorage('user',res.data.user)
            history.push("/dashboard")

        })
        .catch((e)=>{
            console.log('Error: ', e)
        })
    }
    return(
                <GoogleLogin
                    clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    className='google-button'
                />
    )

}
export default Google;