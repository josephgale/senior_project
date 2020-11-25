import React, {useState,useEffect} from 'react';
import Layout from '../../components/layout'
import Axios from 'axios'
import {useHistory} from 'react-router-dom'
import Lessons from '../../components/lessons'


const Dashboard = () => {
    //set state for lessons that teacher is teaching; each lesson an object
    const [values,setValues] = useState({    
        lessons: [] 
    });

    useEffect(() => {     
        console.log('State update!! const values = ', values) 
        lessonsAPICall()        
      }, []);

    //prep for routing to other pages
    const history = useHistory();
    const toAddLesson = () => history.push("/newLesson")

    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email
    const lessonsAPICall =()=>{ 
        Axios(
            {
            method: 'POST',
            url: '/api/getLessons',
            data: {email}
            }
        )
        .then((res)=>
            { 
                setValues({values,lessons: res.data.lessons})
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))
           
    }

    return(
        <Layout>           
            <h1>Dashboard Page</h1>
            <ul> Components Needed
                <li>Do a lesson</li>
                <li>Sign up for a lesson</li>
            </ul>
            <hr></hr>
            <h2>Lessons you're teaching</h2>
            <Lessons lessons={values.lessons}/> 
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