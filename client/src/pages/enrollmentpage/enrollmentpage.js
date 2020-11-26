import React,{useEffect,useState} from 'react'
import {useHistory,withRouter} from 'react-router-dom'
import Axios from 'axios'
import Layout from '../../components/layout'

const Enroll = () => {
    
    //create state so that once user enrolls in class it disappears from available options
    const [values, setValues] = useState({
        enrollmentOptions:[],
        
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
                setValues({values,enrollmentOptions: res.data})
                console.log('Returned data from getEnrollmentOptions:',res.data)
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))        
    }


    const enroll = (classObject) =>{
        console.log('You have enrolled in', classObject)
        Axios(
            {
                method: 'POST',
                url: '/api/enroll',
                data: {
                    email,
                    lesson_id:classObject.lesson_id,
                    teacher: classObject.teacher,
                    lessonName: classObject.lessonName
                }
            }
        )
        .then((res)=>
            { 
                //setValues({values,enrolled: res.data})
                console.log('Returned data from api:',res)
                //this resests the state to current data in database
                enrollmentOptionsAPICall()
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))  
    }

    //set up history and routes
    const history = useHistory()
    const toDashboard = () => history.push('/dashboard')

    return(
        <Layout>
            <h1>Enrollment page</h1>
            <ul><lh>Enrollment Options</lh>
            {
                values.enrollmentOptions.map((each)=>
                    <li key={each.lesson_id}>
                        {each.teacher} --- {each.lessonName}
                        <button onClick={()=>enroll(each)}>Enroll</button>
                    </li>
                )
            }
            </ul>
            <button onClick={toDashboard}>Return to dashboard</button>
        </Layout>
    )
}

export default withRouter(Enroll)