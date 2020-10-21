import React,{Component, useState} from 'react';
import Layout from '../../components/layout';
import {Form,Body,Input,Column,SelectBox} from './signup.styles';

const SignupPage = () =>{
    const [values,setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const signupForm = () => (
        <Form>
            <div className="form-group">
                <label >First Name</label>
                <input className="form-control" type='text'/>
            </div>
            <div className="form-group">
                <label >Last Name</label>
                <input className="form-control" type='text'/>
            </div>
            <div className="form-group">
                <label >Email Address</label>
                <input className="form-control" type='text'/>
            </div>
            <div className="form-group">
                <label >Password</label>
                <input className="form-control" type='password'/>
            </div>
            <div className="form-group">
                <label >Re-enter password</label>
                <input className="form-control" type='password'/>
            </div>
            <div className="form-group">
                <label>Account type</label>
                <br></br>
                <SelectBox className="browser-default custom-select" name="role">
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                </SelectBox>
            </div>
            <div className="form-group">
                <Input className="btn-danger" type='submit' value="Sign up"/>
            </div>
        </Form>
);
    return(        
        <Layout>
            <Body>
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
                
            </Body>
        </Layout>
       
    )
}

export default SignupPage;