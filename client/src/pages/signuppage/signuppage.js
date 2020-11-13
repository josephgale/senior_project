import React,{useEffect, useState} from 'react';
import Layout from '../../components/layout';
import {Form,Input,Column,SelectBox} from './signup.styles';
import {ValidateFields} from '../../validation/validation';
import axios from 'axios';


const SignupPage = () =>{
    const [values,setValues] = useState({        
        firstName: "",
        lastName: "",
        email: "",
        password1: "",
        password2: "",
        role: "student",
        errors:{
        }
    });

    //validate client-side in real-time
    useEffect(()=>{        
        ValidateFields(values,setValues);
        console.log("Errors:")
        console.log(Object.values(values.errors))

    },[values.email,values.firstName,values.lastName,values.password1,values.password2])


    //handleChange is curried function that changes state
    const handleChange=(name)=>(event)=>{
        //create object, use spread operator, include state array(values), change a state key/value pair
        setValues({...values,[name]:event.target.value})        

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
                axios({
                method: 'post',
                url: '/api/signup',
                data:{
                    name: values.firstName + ' ' + values.lastName,
                    email: values.email,
                    password:values.password1,
                    role: values.role
                }
            });
            console.log('form was submitted:',values)
            }
        }
    }

    const signupForm = () => (
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label >First Name</label>
                <input className="form-control" type='text' onChange={handleChange('firstName')}/>
                <p style={{color:"red"}}>{values.errors['firstName']? values.errors['firstName']: ''}</p>
            </div>
            <div className="form-group">
                <label >Last Name</label>
                <input className="form-control" type='text' onChange={handleChange('lastName')}/>
                <p style={{color:"red"}}>{values.errors['lastName']? values.errors['lastName']: ''}</p>
            </div>
            <div className="form-group">
                <label >Email Address</label>
                <input className="form-control" type='text' onChange={handleChange('email')}/>
                <p style={{color:"red"}}>{values.errors['email']? values.errors['email']: values.errors['emailFound']? values.errors['emailFound']:''}</p>
            </div>
            <div className="form-group">
                <label >Password</label>
                <input className="form-control" type='password' onChange={handleChange('password1')}/>
                <p style={{color:"red"}}>{values.errors['password1']? values.errors['password1']: ''}</p>
                
            </div>
            <div className="form-group">
                <label >Re-enter password</label>
                <input className="form-control" type='password' onChange={handleChange('password2')}/>
                {/* <p style={{color:"red"}}>{values.errors['password2']? values.errors['password2']: ''}</p> */}
                <p style={{color:"red"}}>{values.errors['password2']? values.errors['password2']: values.errors['matchPasswords']? values.errors['matchPasswords']: ''}</p>

            </div>
            {/* <div className="form-group">
                <label>Account type</label>
                <br></br>
                <SelectBox className="browser-default custom-select" name="role" onChange={handleChange('role')}>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                </SelectBox>
            </div> */}
            <div className="form-group">
                <Input className="btn-danger" type='submit' value="Sign up"/>
                <p style={{color:"red",fontSize:22}}>{values.errors['submit']? values.errors['submit']: ''}</p>

            </div>
        </Form>
);
    return(   
        <Layout>            
                <div className='container'>
                    <div className='row'>
                        <Column className="col-sm-12 col-md-6">
                            <div>
                                Sign up today for a free account 
                            </div>
                        </Column>
                        <Column className="col-sm-12 col-md-6">
                            {signupForm()}
                        </Column>
                    </div>
                </div>
        </Layout>
    )
}

export default SignupPage;