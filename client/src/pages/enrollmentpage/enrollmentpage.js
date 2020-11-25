import React,{useEffect,useState} from 'react'
import {useHistory,withRouter} from 'react-router-dom'
import Axios from 'axios'
import Layout from '../../components/layout'

const Enroll = () => {
    
    //create state so that once user enrolls in class it disappears from available options
    const [values, setValues] = useState({
        lessons:[]
    })

    //useEffect will populate initital enrollment list and update as user enrolls in classes
    useEffect(() => { 
        enrollmentOptionsAPICall()       
      }, []);


    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email 
    
    //creates an array of lesson objects containing lesson_id, lesson name, instructor name and adds it to state
    const enrollmentOptionsAPICall =()=>{ 
        Axios(
            {
            method: 'POST',
            url: '/api/getEnrollmentOptions',
            data: {email}
            }
        )
        .then((res)=>
            { 
                //setValues({values,lessons: res.data.lessons})
                console.log(res.data)
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))        
        }


    const enroll = (classObject) =>{
        console.log('You have enrolled in this class')
        //make ajax call 
    }

    //set up history and routes
    const history = useHistory()
    const toDashboard = () => history.push('/dashboard')

    return(
        <Layout>
            <h1>This is the enrollment page</h1>
            {
                //iterate through state and populate with lesson options:
                <div>
                    <button onClick={enrollmentOptionsAPICall}>Temp - Get enrollment options</button>
                    <p>Class Name -- Instructor Name -- <button onClick={enroll}>Enroll</button></p>
                    <button onClick={toDashboard}>Return to dashboard</button>
                </div>
            }
        </Layout>
        
    )
}

export default withRouter(Enroll)