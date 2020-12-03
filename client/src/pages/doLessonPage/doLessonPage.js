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
        currentQuestion: props.location.state.currentQuestion,
        currentAnswer: '',
        correctAnswer: props.location.state.correctAnswer.toLowerCase(),
        gotCorrect: ''
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

    const checkAnswer = () => {
        //ajax call to lesson_id from state
        //compare lesson object question/answer with questionNumber,answerValue
    }
    //set history/routing  
    const history = useHistory()
    const toDashboard = () => history.push('/dashboard')

    //functions for microphone / azure api
    let micInput
    function fromMic() {
        let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        
        recognizer.recognizeOnceAsync(result => {
            //this api occaisonally adds a period, so take off last character
            if(result.text.charAt(result.text.length-1)==='.'){
                micInput = result.text.slice(0,-1)
            }else{
                micInput = result.text
            }

            //add text to current answer in state
            setValues({...values,currentAnswer: micInput.toLowerCase()})
        });
    }

    //form functions
    const handleChange = (e) => {
        setValues({...values,currentAnswer:e.target.value})
    }

    //check answer
    let errorMessage
    const submitHandler = (e) => {
        e.preventDefault()
        console.log('values to compare: ', values.currentAnswer, values.correctAnswer)
        if(!values.currentAnswer === values.correctAnswer){
            setValues({...values,gotCorrect:'false'})
        }else{
            //trigger success message
            setValues({...values,gotCorrect:'true'})

            //update state so proper question can render next
            const completed = values.completed + 1
            setValues({...values,completed:completed })
            
            //get user id from local storage to authenticate API call
            const user = localStorage.getItem('user')
            const email = JSON.parse(user).email 

            //update database with completed +1
            Axios(
                {
                    method: 'POST',
                    url: '/api/updateLessonProgress',
                    data: {
                        email,
                        lessonId:values.lessonId,
                        completed:values.completed
                    }
                }
            )
            .then((res)=>
                { 
                    console.log('axios then response')
                }
            )
            .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))   
        }
    }

    const doLessonForm = () => (
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Current Question</label>
                <input className="form-control" type="text" name="lessonName" value={values.currentQuestion}/>
            </div>
            <div className="form-group">
                <label>Your Answer</label>
                <input className="form-control" name="lessonName" value={values.currentAnswer} onChange={handleChange}/>
            </div>
            <div>
            <button type='button' onClick={fromMic}>Record your Answer</button>
            </div>            
            <div className="form-group">
                <input type="submit" value="Check Answer" />
                <p style={{color:"red"}}>{values.gotCorrect=='false'? 'Sorry, try again': values.gotCorrect=='true'?'Correct!':''}</p>
            </div>
            <div>
            <button type='button' onClick={console.log('going to next quesiton')}>Go to next question</button>
            </div>
        </Form>
    )
    return(
        <Layout>           
            <h1>Do Lesson Page</h1>
            {doLessonForm()}
            <button onClick={toDashboard}>To Dashboard</button>      
            {console.log('on render, here are values of state: ', values)}      
        </Layout>
        
    )
}

export default withRouter(DoLesson)