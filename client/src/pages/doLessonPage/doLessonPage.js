import React, {useEffect,useState} from 'react'
import Layout from '../../components/layout'
import {useHistory,withRouter} from 'react-router-dom'
import Axios from 'axios'
import {Form} from '../signuppage/signup.styles'
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const speechConfig = sdk.SpeechConfig.fromSubscription("e1f8581561cb4f75a9da97c1bcdba067", "eastus");

const DoLesson = (props) => {
    const [values, setValues] = useState({
        lessonId: props.location.state.lessonId,
        completed: props.location.state.completed,
        score: props.location.state.score,
        currentQuestion: 'What is the meaning of life?',
        currentAnswer: ''
    })

    //update state every time user completes a question
    // useEffect(() => { 
    //     updateLessonProgress()       
    //   }, []);

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
                if(values.completed==0){
                    setValues({values,currentQuestion: res.data.question1})
                }
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

    const submitHandler = (e) => {
        e.preventDefault()
        console.log('Here is what was submitted for form: ', e)
    }

    //functions for microphone / azure api
    let micInput
    function fromMic() {
        let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        
        recognizer.recognizeOnceAsync(result => {
            micInput = result.text
            //add text to current answer in state
            setValues({values,currentAnswer: result.text})
            
            console.log(micInput)
        });
    }

    const doLessonForm = () => (
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Current Question</label>
                <input className="form-control" type="text" name="lessonName" value={values.currentQuestion}/>
            </div>
            <div className="form-group">
                <label>Your Answer</label>
                <input className="form-control" type="text" name="lessonName" value={values.currentAnswer}/>
            </div>
            <div>
            <button type='button' onClick={fromMic}>Record your Answer</button>
            </div>
            <div className="form-group">
                <input type="submit" value="Check Answer" />
            </div>
        </Form>
    )
    return(
        <Layout>
           
            {/* {renderQuestion(values.lessonId)} */}
            <h1>Do Lesson Page</h1>
            <button onClick={()=>renderQuestion(values.lessonId)}>Render Question</button>
            {doLessonForm()}
            <button onClick={toDashboard}>To Dashboard</button>            
        </Layout>
        
    )
}

export default withRouter(DoLesson)