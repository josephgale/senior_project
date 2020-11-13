import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
require('dotenv').config();

const Google = () => {
    const responseGoogle = (res)=>{
        console.log(res)
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
            {console.log('The google environment var is: ', process.env.REACT_APP_GOOGLE_CLIENT_ID)}
        </div>
    )

}
export default Google