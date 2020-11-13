/* This page does the following: 
1. Allows the user to type in 2 passwords
2. Submits the two passwords with the JSON token to the API
3. Returns a message if there is an error
4. Redirects to a sign in page if successful

* This page is rendered when user clicks on link in email
* This page is rendered from React route, not API route because API cannot render pages
*/
import axios from 'axios';
import React,{ useEffect,useState} from 'react';
import ValidatePasswords from '../../validation/validatePasswords'
import {Form, Input} from '../signuppage/signup.styles'
import Layout from '../../components/layout';

const PwReset = (props) => {
    //create state for passwords, errors, messages; token not needed in state
    const [values,setValues] = useState({
        password1: '',
        password2: '',
        errors: {},
        success: ''
    });

    //validate that pw's match and fit requirements in real time
    useEffect(()=>{        
        ValidatePasswords(values,setValues);
        console.log("Errors:")
        console.log(Object.values(values.errors))

    },[values.password1,values.password2])

    //use hook to change state for every keystroke
    const handleChange = (name) => (event)=>{
        setValues({...values,[name]:event.target.value})   
    }

    const token = props.match.params.token

    const submitHandler = (event) => {
        if(event){
            event.preventDefault();
            console.log('form has been submitted')
            console.log(Object.values(values.errors))

            //check for errors before submitting. Better way than values.errors.error?
            if(values.errors.password1||values.errors.password2||values.errors.matchPasswords){
                console.log('Here are the errors: ', values.errors)
                return
            }
            //submit token&password to API for validation/reset
            axios({
                method: 'post',
                url: `/api/pwReset`,
                data: {
                    password: values.password1,
                    token
                }
            })
            //if successful, set success message
            .then(()=>{
                setValues({...values,success:'Password successfully changed. Please log in.'})
            })
            //set error message directing user to try again (due to token expiration)
            .catch((e)=>{
                setValues({...values,errors:{reset:'Password reset failed. Please go to forgot password page and try again'}})
                console.log("Token was invalid")
            })

            
        }
    }
    const pwResetForm = () => (
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Pasword</label>
                <Input name="password1" className="form-control" type="password" onChange={handleChange('password1')}/>
                <p style={{color:"red"}}>{values.errors['password1']? values.errors['password1']: ''}</p>
            </div>
            <div className="form-group">
                <label>Retype your password</label>
                <Input name="password2" className="form-control" type="password" onChange={handleChange('password2')} />
                <p style={{color:"red"}}>{values.errors['password2']? values.errors['password2']: values.errors['matchPasswords']? values.errors['matchPasswords']:''}</p>
            </div>
            <div className="form-group">
                <Input className="btn-danger" type="submit" value="Submit" />
                <p style={{color:"red"}}>{values.success? values.success: values.errors['reset']? values.errors['reset']:''}</p>
            </div>
        </Form>
    )
    return(
        <Layout>
            <div>
                <h1>Password Reset Page</h1>
                {pwResetForm()}
            </div>
        </Layout>

    )
}

export default PwReset