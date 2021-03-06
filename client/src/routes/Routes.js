import React from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import App from '../App';
import SignupPage from '../pages/signuppage/signuppage'
import LoginPage from '../pages/loginpage/loginpage'
import ActivationPage from '../pages/activationpage/activationpage'
import PwResetRequest from '../pages/pwresetrequestpage/pwresetrequestpage'
import PwReset from '../pages/pwresetpage/pwresetpage'
import Dashboard from '../pages/dashboardpage/dashboardpage'
import PrivateRoute from './PrivateRoute'
import Logout from './Logout'
import NewLesson from '../pages/newlessonpage/newlessonpage'
import EditLesson from '../pages/editlessonpage/editlessonpage'
import Enrollment from '../pages/enrollmentpage/enrollmentpage'
import DoLesson from '../pages/doLessonPage/doLessonPage'
import AccountPage from '../pages/accountpage/accountpage'

const Routes = () => {
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={App}/>
                <Route path='/signup' component={SignupPage}/>
                <Route path='/login' component={LoginPage}/>
                <Route path='/logout' component={Logout}/>
                <Route path='/activate/:token' component={ActivationPage}/>
                <Route path='/pwResetRequest' component={PwResetRequest}/>
                <Route path='/pwReset/:token' component={PwReset}/>
                <PrivateRoute path='/dashboard' component={Dashboard}/>
                <PrivateRoute path='/newLesson' component={NewLesson}/>
                <PrivateRoute path='/editLesson' component={EditLesson}/>
                <PrivateRoute path='/enroll' component={Enrollment}/>
                <PrivateRoute path='/doLesson' component={DoLesson}/>
                <PrivateRoute path='/account' component={AccountPage}/>
            </Switch>
        </BrowserRouter>
    )
}
export default Routes;