import React, {useEffect,useState} from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'
import Students from './students'

const Teaching = (props) => {   
        
    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email 

    //create state so that when lesson deletes it re-renders
    const [values, setValues] = useState({
        lessons:[]
    })

    useEffect(() => { 
        //make api call and load state data on initial render    
        lessonsAPICall()       
      }, []);

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

    
    //prep history
    const history = useHistory();
    const toAddLesson = () => history.push("/newLesson")
    const toEditLessonPage = (lessonObject) => {
        history.push(
            {pathname: '/editLesson',
                state:{
                    lessonName:lessonObject.lessonName,
                    asset: lessonObject.asset,
                    question1: lessonObject.question1,
                    answer1: lessonObject.answer1,
                    question2: lessonObject.question2,
                    answer2: lessonObject.answer2,
                    question3: lessonObject.question3,
                    answer3: lessonObject.answer3
                }
            }
        )
    }
    const deleteLesson = (lessonObject)=>{
        console.log('Deleting lesson',lessonObject)
        Axios(
            {
            method: 'POST',
            url: '/api/deleteLesson',
            data: {
                email,
                lessonName:lessonObject.lessonName
            }
            }
        )
        .then((res)=>
            { 
                console.log('item possibly deleted')
                //make api call, change state with updated lessons so that deleted lessons don't show up
                lessonsAPICall()
                
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))
    }

    return(
        <div>
            <h2>Lessons you're teaching</h2>
            <ul>
                {
                    values.lessons.map((each)=>
                        <li key={each._id}>{each.lessonName}
                            <button onClick={()=>toEditLessonPage(each)}>Edit</button>
                            <button onClick={()=>deleteLesson(each)}>Delete</button>
                        </li>
                    )
                }
            </ul>
            <button onClick={toAddLesson}>Create a New Lesson</button>
            <Students />
        </div>
       

    )
}

export default Teaching