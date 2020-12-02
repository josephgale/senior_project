import React, {useEffect,useState} from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'

const Enrollment = () => {

    //create state so that once user enrolls in class it disappears from available options
    const [values, setValues] = useState({
        enrolled:[],
    })

    //useEffect will populate initital enrollment list and update as user enrolls in classes, since getEnrolledLessons() changes state
    useEffect(() => { 
        getEnrolledLessons()       
      }, []);

    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email 

    //prep history
    const history = useHistory();
    const toEnrollmentPage = () => history.push('/enroll')
    const toDoLessonPage = (lessonObject) => {
        console.log("do lesson fx object",lessonObject)
        history.push(
            {
                pathname: '/doLesson',
                state:{
                    lessonId: lessonObject.lesson_id,
                    completed: lessonObject.completed,
                    score: lessonObject.score
                }
            }
        )
    }

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
                console.log('enrolled array ', res.data)
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
                        {each.teacher} --- {each.lessonName} --- {each.completed} --- {each.score}
                        <button onClick={()=>toDoLessonPage(each)}>Start or Resume Lesson</button>
                    </li>
                )
            }
        </div>
    )
}

export default Enrollment