import React from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import App from '../App';
import SignupPage from '../pages/signuppage/signuppage'
import LoginPage from '../pages/loginpage/loginpage'

const Routes = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={App}/>
                <Route path='/signup' component={SignupPage}/>
                <Route path='/login' component={LoginPage}/>
            </Switch>
        </BrowserRouter>
    )
}
export default Routes;