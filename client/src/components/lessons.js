import React from 'react'
import {useHistory} from 'react-router-dom'

const Lessons = (props) => {    
    const history = useHistory();
    //when routing to toEditLessonPage, add an object with the state that will be present on toEditLessonPage
    const toEditLessonPage = (props) => {
        history.push(
            {pathname: '/editLesson',
                state:{
                    lessonName:props.lessonName,
                    asset: props.asset,
                    question1: props.question1,
                    answer1: props.answer1,
                    question2: props.question2,
                    answer2: props.answer2,
                    question3: props.question3,
                    answer3: props.answer3
                }
            }
        )
    }

    return(
        <div>
            <ul>
                {
                Object.keys(props.lessons)
                    .map((each)=>
                        {   return <li key={each}>
                            {props.lessons[each].lessonName}
                            <button onClick={()=>toEditLessonPage(props.lessons[each])}>Edit</button>
                            <button>Delete</button></li>
                        }
                    )
                }
            </ul>
        </div>
       

    )
}

export default Lessons