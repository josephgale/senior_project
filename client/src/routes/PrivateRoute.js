import React from 'react';
import {Route,Redirect} from 'react-router-dom';
import {isAuth} from  '../validation/helpers';

//this code is from oreillyl tutorial based off of documentation

const PrivateRoute = ({component: Component,...rest})=>(
    <Route {...rest} render={
        props=>isAuth() ? <Component {...props} /> : <Redirect to={{
            pathname: '/login',
            state: {from:props.location}
        }}/>
    }>

    </Route>
)

export default PrivateRoute;