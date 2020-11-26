import React, {useEffect,useState} from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'

const Enrollment = () => {

    //create state so that once user enrolls in class it disappears from available options
    const [values, setValues] = useState({
        enrolled:[],
    })

    //useEffect will populate initital enrollment list and update as user enrolls in classes
    useEffect(() => { 
        getEnrolledLessons()       
      }, []);

    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email 

    //prep history
    const history = useHistory();
    const toEnrollmentPage = () => history.push('/enroll')

    const getEnrolledLessons =()=>{ 
        Axios(
            {
            method: 'POST',
            url: '/api/getEnrolledLessons',
            data: {email}
            }
        )
        .then((res)=>
            { 
                setValues({values,enrolled: res.data})
                //console.log('Returned data from getEnrollmentOptions:',res.data)
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))        
    }
    return(
        <div>
            <h2>Enrollment </h2>
            <p><button onClick={toEnrollmentPage}>Enroll in a class</button></p>
            <p>Your lessons:</p>

            {
                values.enrolled.map((each)=>
                    <li key={each.lesson_id}>
                        {each.teacher} --- {each.lessonName}
                        <button>Start or Resume Lesson</button>
                    </li>
                )
            }
        </div>
    )
}

export default Enrollment