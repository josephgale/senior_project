import React from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'

const Enrollment = () => {

    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email 

    //prep history
    const history = useHistory();
    const toEnrollmentPage = () => history.push('/enroll')
    return(
        <div>
            <h2>Enrollment </h2>
            <p><button onClick={toEnrollmentPage}>Enroll in a class</button></p>
            <p>Your courses:</p>
            {
                <ul>
                    <li>My lesson<button>Start or Resume Lesson</button></li>
                </ul>
            }
        </div>
    )
}

export default Enrollment