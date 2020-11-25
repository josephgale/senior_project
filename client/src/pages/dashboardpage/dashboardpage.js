import React from 'react';
import Layout from '../../components/layout'
import Teaching from '../../components/teaching'
import Enrollment from '../../components/enrollment'


const Dashboard = () => {
    return(
        <Layout>  

            <h1>Dashboard Page</h1>
            <ul> Components Needed
                <li>Do a lesson</li>
                <li>Sign up for a lesson</li>
            </ul>
            <hr></hr> 

            <Teaching />  
            <hr></hr>

            <Enrollment />               
            <hr></hr>
        </Layout>
        
    )
}

export default Dashboard;