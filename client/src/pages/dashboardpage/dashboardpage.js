import React from 'react';
import '../../App.css'
import {Row,Col} from 'react-bootstrap'
import {Body} from './dashboardpagestyles';
import Layout from '../../components/layout'
import Teaching from '../../components/teaching'
import Enrollment from '../../components/enrollment'
import Students from '../../components/students'

const Dashboard = () => {
    const user = localStorage.getItem('user')
    
    return(
        <Layout>  
            <Body>
            <Row>
                <Col>
                    <h1 className='h1-white'>Dashboard</h1>     
                </Col>
                <Col>
                    <div className='welcome-message'>
                        <p>Welcome, {JSON.parse(user).name}</p>
                    </div>
                </Col>

            </Row>
            <Row>
                
                           
            </Row>
            <Row>
                <Col>
                    <Teaching />  
                    <Students />    
                </Col>
                <Col>
                    <Enrollment />  
                    <div className="features-list-div">
                        <h1 className='h1mod-alt'>Notes on Lesson Component</h1>
                        <ul className='features-list'>
                            <li>React hooks update state on on each keystroke</li>
                            <li>UseEffect() hook triggers functions which make AJAX calls on each state update to validate each field, starting when the page renders.</li>
                        </ul>
                    </div>
                </Col>  
            </Row>
            </Body>
        </Layout>
        
    )
}

export default Dashboard;