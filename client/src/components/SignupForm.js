import React, {Component} from 'react';

const SignupForm = () => {
    return(
        <form>
            <div className="form-group">
                <label >First Name</label>
                <input type="text" className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Last Name</label>
                <input type="text" className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Email Address</label>
                <input type="email" className="form-control"/>
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input type="password" className="form-control"/>
            </div>
            <div>
                <button className="btn btn-primary">Submit</button>
            </div>
        </form>
    );
}

export default SignupForm;