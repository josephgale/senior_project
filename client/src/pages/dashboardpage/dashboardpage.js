import React, {useState,useEffect} from 'react';
import Layout from '../../components/layout'
import {getCookie} from '../../validation/helpers'
import Axios from 'axios'
import {useHistory} from 'react-router-dom'
import {Redirect } from 'react-router'
import getAllLessons from '../../functions/lessonList'

const Dashboard = (props) => {
    const [values,setValues] = useState({     
        teaching: {}
    });

    useEffect(() => {              
      }, [values]);

    //get user id from local storage
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email
    
    //prep for routing to other pages
    const history = useHistory();
    const toAddLessonComp = () => {   
        history.push("/newLesson")
        
    }

    const toEditLessonPage = (lesson) => {
        history.push({
            pathname: '/editLesson',
            state:{
                lesson
            }
        })
        
    }

    const allLessons = []
    const getAllLessons = () => {        
        Axios({
            method: 'POST',
            url: '/api/getLessons',
            data: {email}
        })
        .then((res)=>{
                //console.log('retreiving all lessons',res.data)                
                Object.keys(res.data).forEach(key=>{
                    allLessons.push(res.data[key].lessonName)
                })
                
                //this is an async method that cannot be awaited, which is why foreach didn't work
                setValues({...values,teaching:allLessons})
                
            })
        .catch((e)=>console.log('could not retrieve all lessons', e))
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
            <button onClick={getAllLessons}>Retrieve Lessons</button> 
                <ul>{Object.keys(values.teaching).map((each)=>{
                    return <li key={each}>{values.teaching[each]}<button onClick={()=>toEditLessonPage(values.teaching[each])}>Edit</button><button>Delete</button></li>
                })}</ul>
            <button onClick={toAddLessonComp}>click here to add a lesson</button>
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