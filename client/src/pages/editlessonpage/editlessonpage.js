import React, {useEffect, useState} from 'react'
import Layout from '../../components/layout'
import {withRouter} from 'react-router-dom'
import {Form} from '../signuppage/signup.styles'
import Axios from 'axios'
import {useHistory} from 'react-router-dom'

const EditLesson = (props) => {
    const [myValues,setmyValues] = useState({   
        originalName: props.location.state.lessonName,
        lessonName: props.location.state.lessonName || "",
        asset: "",
        question1: props.location.state.question1 || "",
        answer1: props.location.state.answer1 || "",
        question2: props.location.state.question2|| "",
        answer2: props.location.state.answer2 || "",
        question3: props.location.state.question3 || "",
        answer3: props.location.state.answer3 || ""
    });

    useEffect(()=>{        
        console.log('state has changed for lesson form: ', myValues)

    },[myValues.lessonName])

    const user = localStorage.getItem('user')
    const id = JSON.parse(user)._id
    const email = JSON.parse(user).email
    const history = useHistory()

    const submitHandler = (e) => {
        e.preventDefault()
        Axios({
            method: 'POST',
            url:'/api/updateLesson',
            data:{
                id,
                email,
                originalName: myValues.originalName,
                lessonName: myValues.lessonName,
                asset: myValues.asset,
                question1: myValues.question1,
                answer1: myValues.answer1,
                question2: myValues.question2,
                answer2: myValues.answer2,
                question3: myValues.question3,
                answer3: myValues.answer3,

            }
        })
        .then(
            history.push('/dashboard')
            )
        .catch(
                (e)=>console.log(e)
            )
    }
    const handleChange = (e,value) => {
        console.log('here are the props: ', props)
        setmyValues({...myValues,[value]:e})
        console.log(myValues)
    }

    const editLessonForm = () => (
        
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Lesson Title</label>
                <input className="form-control" type="text" name="lessonName" value={myValues.lessonName} onChange={(e)=>handleChange(e.target.value,'lessonName')}/>
            </div>
            <div className="form-group">
                <label>Asset</label><br></br>
                <input type="file" name="asset" value={myValues.asset} onChange={(e)=>handleChange(e.target.value,'asset')}/>
            </div>
            <div className="form-group">
                <label>Question 1</label>
                <input className="form-control" type="text" name="question1" value={myValues.question1} onChange={(e)=>handleChange(e.target.value,'question1')}/>
            </div>
            <div className="form-group">
                <label>Answer 1</label>
                <input className="form-control" type="text" name="answer1" value={myValues.answer1} onChange={(e)=>handleChange(e.target.value,'answer1')}/>
            </div>
            <div className="form-group">
                <label>Question 2</label>
                <input className="form-control" type="text" name="question2"value={myValues.question2} onChange={(e)=>handleChange(e.target.value,'question2')}/>
            </div>
            <div className="form-group">
                <label>Answer 2</label>
                <input className="form-control" type="text" name="answer2" value={myValues.answer2} onChange={(e)=>handleChange(e.target.value,'answer2')}/>
            </div>
            <div className="form-group">
                <label>Question 3</label>
                <input className="form-control" type="text" name="question3" value={myValues.question3} onChange={(e)=>handleChange(e.target.value,'question3')}/>
            </div>
            <div className="form-group">
                <label>Answer 3</label>
                <input className="form-control" type="text" name="answer3" value={myValues.answer3} onChange={(e)=>handleChange(e.target.value,'answer3')}/>
            </div>
            <div className="form-group">
                <input type="submit" value="Update Lesson" />
            </div>
        </Form>
    )
    return(
        <Layout>
            {editLessonForm()}
        </Layout>
        
    )
}

//withRouter fx needed for each pushed page to render new updates
export default withRouter(EditLesson)