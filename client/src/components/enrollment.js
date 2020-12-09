import React, {useEffect,useState} from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'

const Enrollment = () => {

    //create state so that once user enrolls in class it disappears from available options
    const [values, setValues] = useState({
        enrolled:[]
    })

    //useEffect will populate initital enrollment list and update as user enrolls in classes, since getEnrolledLessons() changes state
    useEffect(() => { 
        getEnrolledLessons() 
      }, [values.enrolled]);

    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email 

    //prep history
    const history = useHistory();
    const toEnrollmentPage = () => history.push('/enroll')
    
    const toDoLessonPage = async (lessonObject) => {
       let currentQuestion, correctAnswer
        await Axios(
                {
                method: 'POST',
                url: '/api/getLessonById',
                data: {lessonId:lessonObject.lesson_id}
                }
            )
            .then((res)=>
                { 
                    if(lessonObject.completed===0){
                        currentQuestion = res.data.question1
                        correctAnswer = res.data.answer1
                    }
                    if(lessonObject.completed===1){
                        currentQuestion = res.data.question2
                        correctAnswer = res.data.answer2
                    }
                    if(lessonObject.completed===2){
                        currentQuestion = res.data.question3
                        correctAnswer = res.data.answer3
                    }
                    if(lessonObject.completed>=3){
                        currentQuestion = res.data.question1
                        correctAnswer = res.data.answer1
                    }

                    //history.push nested here because correctAnswer not rendering on next page 
                    history.push(
                        {
                            pathname: '/doLesson',
                            state:{
                                lessonId: lessonObject.lesson_id,
                                completed: lessonObject.completed,
                                score: lessonObject.score,
                                currentQuestion,
                                correctAnswer
                            }
                        }
                    )
                }
            )
            .catch((e)=>console.log('Problem retrieving this lesson from API: ', e)) 
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
                setValues({...values,enrolled: res.data})
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))        
    }
    return(
        <div className="dash-section">
            <h2>You are taking:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Instructor</th>
                        <th>Lesson</th>
                        <th>Completed</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
            {
                values.enrolled.map((each)=>
                    <tr key={each.lesson_id}>
                        <td>{each.teacher}</td>
                        <td>{each.lessonName}</td>
                        <td>{each.completed}/3</td>
                        <td>{each.score}/3</td>
                        {each.score<1?
                            <td>
                                <button onClick={()=>toDoLessonPage(each)}>
                                    Start Lesson
                                </button>
                            </td>:
                            <td>
                                <button onClick={()=>toDoLessonPage(each)}>
                                    Resume Lesson
                                </button>
                            </td>
                        }
                        </tr>
                )
            }
                </tbody>
            </table>
            <p> 
                <button className="dash-button" onClick={toEnrollmentPage}>
                    Enroll in a class
                </button>
            </p>

        </div>
    )
}

export default Enrollment