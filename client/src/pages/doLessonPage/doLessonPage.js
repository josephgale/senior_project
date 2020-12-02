import React, {useEffect,useState} from 'react'
import Layout from '../../components/layout'
import {useHistory,withRouter} from 'react-router-dom'
import Axios from 'axios'

const DoLesson = (props) => {
    const [values, setValues] = useState({
        lessonId: props.location.state.lessonId,
        completed: props.location.state.completed,
        score: props.location.state.score,
        currentQuestion: '',
        currentAnswer: ''
    })

    //update state every time user completes a question
    useEffect(() => { 
        updateLessonProgress()       
      }, []);

    //take current question and update to database
    const updateLessonProgress = () =>{
        console.log('Updating lesson')
    }

    const renderQuestion = (lessonId) => {
        console.log('The question has been rendered')
        //ajax call to get all lesson info based on state of completed
        Axios(
            {
            method: 'POST',
            url: '/api/getLessonById',
            data: {lessonId}
            }
        )
        .then((res)=>
            { 
                console.log('enrolled array ', res.data)
                console.log('questions completed: ', values.completed)
                //if values.completed==0, then values.currentQuestion=

            }
        )
        .catch((e)=>console.log('Problem retrieving this lesson from API: ', e)) 
        //render lesson info on a form
    }

    const checkAnswer = (questionNumber, answerValue) => {
        //ajax call to lesson_id from state
        //compare lesson object question/answer with questionNumber,answerValue
    }
    //set history/routing  
    const history = useHistory()
    const toDashboard = () => history.push('/dashboard')
    return(
        <Layout>
            <h1>Do Lesson Page</h1>
            <button onClick={toDashboard}>To Dashboard</button>
            <button onClick={()=>renderQuestion(values.lessonId)}>Render Question</button>
            {renderQuestion()}
            {console.log(props.location.state)}
        </Layout>
        
    )
}

export default withRouter(DoLesson)