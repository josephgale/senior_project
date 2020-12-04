import React, {useEffect, useState} from 'react'
import Layout from '../../components/layout'
import {withRouter} from 'react-router-dom'
import {Form} from '../signuppage/signup.styles'
import Axios from 'axios'
import {useHistory} from 'react-router-dom'
import {ValidateFields} from '../../validation/validation';

const Account = (props) => {
    //declare constants for history and initial state setup
    const history = useHistory()
    const user = localStorage.getItem('user')
    const name = JSON.parse(user).name
    const id = JSON.parse(user)._id //not for form but needed for ajax
    const email = JSON.parse(user).email
    
    //create state    
    const [values,setValues] = useState({   
        id,
        name,
        email,
        password1: '',
        password2: '',
        errors: {},
        success: ''
    })

    //validate client-side in real-time
    useEffect(()=>{        
        ValidateFields(values,setValues);
        console.log("Errors:")
        console.log(Object.values(values.errors))

    },[values.email,values.firstName,values.lastName,values.password1,values.password2])

    const handleChange = (e,varToChange) => {
        setValues({...values,[varToChange]:e})
    }
    
    const submitHandler = (event) => {
        //if statement required
        if(event){
            //prevent page refresh once submitted
            event.preventDefault();
            console.log('login attempted')

            //prevent form submission if errors exists
            if(values.errors.firstName||values.errors.lastName||values.errors.matchPasswords||values.errors.password1||values.errors.password2||values.errors.emailFound){
                setValues(values=>({...values,errors:{...values.errors,submit:'**Please fill out all fields correctly'}})) 
                return
            }else{
                setValues(values=>({...values,errors:{...values.errors,submit:''}}))  
                //make ajax call to API for user creation
                Axios({
                    method: 'post',
                    url: '/api/updateAccountInfo',
                    data:{
                        id,
                        name: values.name,
                        email: values.email,
                        password:values.password1
                    }
                }).then((res)=>{
                    setValues({...values,success: 'Information updated'})
                });
            console.log('form was submitted:',values)
            }
        }
    }

    const editAccountForm = () => (
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Name</label>
                <input className="form-control" type="text" name="lessonName" value={values.name} onChange={(e)=>handleChange(e.target.value,'name')}/>
            </div>
            <div className="form-group">
                <label>Email</label>
                <input className="form-control" type="text" name="lessonName" value={values.email} onChange={(e)=>handleChange(e.target.value,'email')} />
                <p style={{color:"red"}}>{values.errors['email']? values.errors['email']: values.errors['emailFound']? values.errors['emailFound']:''}</p>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input className="form-control" type="password" name="lessonName" value={values.password1} onChange={(e)=>handleChange(e.target.value,'password1')} />
                <p style={{color:"red"}}>{values.errors['password1']? values.errors['password1']: ''}</p>
            </div>
            <div className="form-group">
                <label>Retype Password</label>
                <input className="form-control" type="password" name="lessonName" value={values.password2} onChange={(e)=>handleChange(e.target.value,'password2')}/>
                <p style={{color:"red"}}>{values.errors['password2']? values.errors['password2']: values.errors['matchPasswords']? values.errors['matchPasswords']: ''}</p>

            </div>
            <div className="form-group">
                <input type="submit" value="Update Information" />
                <p style={{color:"red",fontSize:22}}>{values.errors['submit']? values.errors['submit']: ''}</p>
                <p style={{color:"red",fontSize:22}}>{values.success? values.success: ''}</p>
            </div>
            <div className="form-group">
                <button>Delete Account</button>
            </div>
        </Form>
    )
    

    return (
        <Layout>
            <h1>Account</h1>
             {editAccountForm()}
             {console.log('The current state is ',values)}
        </Layout>
       
    )
}

export default Account