import React from 'react'
import Layout from '../../components/layout'
import {withRouter} from 'react-router-dom'
import {Form} from '../signuppage/signup.styles'
import ImageUploader from 'react-images-upload'
import Axios from 'axios'
import {useHistory} from 'react-router-dom'

const NewLesson = () => {
    const user = localStorage.getItem('user')
    const id = JSON.parse(user)._id
    const email = JSON.parse(user).email
    const history = useHistory()

    const submitHandler = (e) => {
        e.preventDefault()
        Axios({
            method: 'POST',
            url:'/api/newLesson',
            data:{
                id,
                email,
                lessonName: e.target.lessonName.value,
                asset: e.target.asset.value,
                question1: e.target.question1.value,
                answer1: e.target.answer1.value,
                question2: e.target.question2.value,
                answer2: e.target.answer2.value,
                question3: e.target.question3.value,
                answer3: e.target.answer3.value,

            }
        })
        .then(
            history.push('/dashboard')
            )
        .catch(
                (e)=>console.log(e)
            )
    }
    const newLessonForm = () => (
        <Form onSubmit={submitHandler}>
            <div className="form-group">
                <label>Lesson Title</label>
                <input className="form-control" type="text" name="lessonName"/>
            </div>
            <div className="form-group">
                <label>Asset</label><br></br>
                <input type="file" name="asset"></input>
            </div>
            <div className="form-group">
                <label>Question 1</label>
                <input className="form-control" type="text" name="question1"/>
            </div>
            <div className="form-group">
                <label>Answer 1</label>
                <input className="form-control" type="text" name="answer1"/>
            </div>
            <div className="form-group">
                <label>Question 2</label>
                <input className="form-control" type="text" name="question2"/>
            </div>
            <div className="form-group">
                <label>Answer 2</label>
                <input className="form-control" type="text" name="answer2"/>
            </div>
            <div className="form-group">
                <label>Question 3</label>
                <input className="form-control" type="text" name="question3"/>
            </div>
            <div className="form-group">
                <label>Answer 3</label>
                <input className="form-control" type="text" name="answer3"/>
            </div>
            <div className="form-group">
                <input type="submit" value="Add Lesson" />
            </div>
        </Form>
    )
    return(
        <Layout>
            {newLessonForm()}
        </Layout>
        
    )
}

//withRouter fx needed for each pushed page to render new updates
export default withRouter(NewLesson)