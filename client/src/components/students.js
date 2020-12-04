import React, {useEffect,useState} from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'

const Students = () => {
    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email 

    //create state so that when lesson deletes it re-renders
    const [values, setValues] = useState({
        students:[]
    })

    useEffect(() => { 
        //make api call and load state data on initial render    
        //getEnrolledStudents()       
    }, []);

    const getEnrolledStudents =()=>{ 
        Axios(
            {
                method: 'POST',
                url: '/api/getEnrolledStudents',
                data: {teacher:JSON.parse(user).name}
            }
        )
        .then((res)=>
            { 
                console.log('getEnrolledStudents response: ', res.data)
                setValues({...values,students: res.data})
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))        
    }

    return(
        <div>
            <h2>List of Students</h2>
            <button onClick={getEnrolledStudents}>Get enrolled students</button>
            {console.log('Here is the current state of students: ', values.students)}
            {values.students.map
                (
                    (eachStudent)=>
                        (
                            
                            eachStudent.enrolled.map
                                (
                                    (eachClass)=>
                                        {
                                            //only include classes by current teacher
                                            if(eachClass.teacher==JSON.parse(user).name){
                                                return (
                                                    <li>
                                                        {eachStudent.name} --- 
                                                        {eachClass.lessonName} --- 
                                                        {eachClass.completed} ---
                                                        {eachClass.score}
                                                    </li>
                                                )
                                            }
                                            
                                        }
                                )
                        )
                )
            
            }

        </div>
        
    )
}

export default Students;