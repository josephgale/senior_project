import React, {useState,useEffect} from 'react';
import Layout from '../../components/layout'
import {getCookie} from '../../validation/helpers'
import Axios from 'axios'
import {useHistory} from 'react-router-dom'
import {Redirect } from 'react-router'
import getAllLessons from '../../functions/lessonList'

const Dashboard = (props) => {
    //set state for lessons that teacher is teaching; each lesson an object
    const [values,setValues] = useState({     
        
    });

    useEffect(() => {     
        console.log('State update!! const values = ', values)         
      }, [values]);

    //get user id from local storage
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email
    
    //prep for routing to other pages
    const history = useHistory();
    const toAddLesson = () => {   
        history.push("/newLesson")
        
    }

    //when routing to toEditLessonPage, add an object with the state that will be present on toEditLessonPage
    const toEditLessonPage = (values) => {
        history.push({
            pathname: '/editLesson',
            state:{
                lessonName:values.lessonName,
                asset: values.asset,
                question1: values.question1,
                answer1: values.answer1,
                question2: values.question2,
                answer2: values.answer2,
                question3: values.question3,
                answer3: values.answer3

            }
        })
        
    }

    const getLessonsFromAPI = () => {        
        Axios({
            method: 'POST',
            url: '/api/getLessons',
            data: {email}
        })
        .then((res)=>{       
                //set state to all lessons retrieved from api          
                setValues(res.data.lessons)       
            })
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))
           
    }

    return(
        <Layout>
            
            <h1>Dashboard Page</h1>
            <ul> Components Needed
                <li>Add Lesson</li>
                <li>Edit Lesson</li>
                <li>Do a lesson</li>
                <li>Sign up for a lesson</li>
            </ul>
            <hr></hr>
            <h2>Lessons you're teaching</h2>
            {window.onload=getLessonsFromAPI}
                    <ul>
                        {Object.keys(values).map(
                            (each)=>{return <li key={each}>{values[each].lessonName}<button onClick={()=>toEditLessonPage(values[each])}>Edit</button><button>Delete</button></li>})}
                    </ul>
                    
                
            <button onClick={toAddLesson}>click here to add a lesson</button>
            <hr></hr>
            <h2>Lessons you're enrolled in</h2>
            <p>My lesson<button>Start or Resume Lesson</button></p>
            <hr></hr>
            <h2>Sign up for lessons</h2>
            <p>All lessons generate here <button>Add lesson</button></p>
            <hr></hr>

        </Layout>
        
    )
}

export default Dashboard;