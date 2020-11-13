import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
require('dotenv').config();
//const dotenv = require('dotenv')
// import dotenv from 'dotenv';
// dotenv.config()

const Google = () => {
    const responseGoogle = (res) =>{
        console.log(res);
        axios({
            method: 'POST',
            url: 'api/google-login',
            data: {idToken: res.tokenId}
        })
        .then(res=>{
            console.log('Google signin success', res)
        })
        .catch((e)=>{
            console.log('Error: ', e)
        })
    }
    return(
        <div className = "pb-3">
            <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            
        </div>
    )

}
export default Google;