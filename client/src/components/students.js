import React, {useEffect,useState} from 'react'
import Axios from 'axios'

const Students = () => {
    //get user id from local storage to authenticate API call
    const user = localStorage.getItem('user')

    //create state so that when lesson deletes it re-renders
    const [values, setValues] = useState({
        students:[]
    })

    useEffect(() => { 
        //make api call and load state data on initial render    
        getEnrolledStudents()       
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
                setValues({...values,students: res.data})
            }
        )
        .catch((e)=>console.log('Problem retrieving all lessons from API: ', e))        
    }

    return(
        <div className="dash-section">
            <h2>Your students:</h2>
            <table>
                <thead>
                <tr>
                    <th>Instructor</th>
                    <th>Lesson</th>
                    <th>Completed</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
            {
                values.students.map((eachStudent)=>
                    (eachStudent.enrolled.map((eachClass)=>
                        {
                            //only include classes by current teacher
                            if(eachClass.teacher===JSON.parse(user).name){
                                return (
                                    <tr key={eachStudent.name + eachStudent.lessonName}>
                                        <td>{eachStudent.name}</td>
                                        <td>{eachClass.lessonName}</td> 
                                        <td>{eachClass.completed}/3</td>
                                        <td>{eachClass.score}/3</td>
                                    </tr>
                                )
                            }
                            
                        }
                        )
                    )
                )
            }
            </tbody>
            </table>

        </div>
        
    )
}

export default Students;