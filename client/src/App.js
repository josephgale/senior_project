import React from 'react';
import Layout from './components/layout'
import {Container, Row,Col} from 'react-bootstrap'
import './App.css';
import {Body} from './styles'
import Picture from './images/profile.jpg'
import Check from './images/check.png'


const App = () => {
  return(
    <Layout>
      <Body>
      <Row>
            <div>
              <h1 className="h1mod">Rocket</h1>
            </div>
            <div>
              <h1 className='rocket'>Learning Application</h1>
            </div>
      </Row>
        <Container>

          <Row id='row2'>
            <Col md={{span: 4, offset:0}}>
              <img src={Picture} alt="profile"></img>"
              <h2 className='h2mod'>Joseph Gale</h2>
              <h3 className='h3mod'>CIT 490: Senior Project</h3>
              <h4 className='h3mod'>Fall 2020</h4>
              <h4 className='h3mod'>BYU - Idaho</h4>
            </Col>
            <Col md={{span: 8}} sm={{span: 12}}>
              <div class='row2'>
              <ul>
                <span class='featuring'>Featuring:</span> 
                <li>MongoDB<img className='check' src={Check} alt="checkmark"/></li>
                <li>Express.js<img className='check' src={Check} alt="checkmark"/></li>
                <li>React.js<img className='check' src={Check} alt="checkmark"/></li>
                <li>React Hooks<img className='check' src={Check} alt="checkmark"/></li>
                <li>Node.js<img className='check' src={Check} alt="checkmark"/></li>
                <li>Google OAuth<img className='check' src={Check} alt="checkmark"/></li>
                <li>AXIOS<img className='check' src={Check} alt="checkmark"/></li>
                <li>JSON Webtokens<img className='check' src={Check}alt="checkmark" /></li>
                <li>SendGrid API<img className='check' src={Check} alt="checkmark"/></li>
                <li>Azure Voice-To-Text API<img className='check' src={Check} alt="checkmark"/></li>

                
              </ul>
              </div>
            </Col>


          </Row>
        </Container>
        
      </Body>
      
    </Layout>
  )
}

export default App;