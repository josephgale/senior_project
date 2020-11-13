import React, {useState} from 'react';
import Layout from '../../components/layout';
import axios from 'axios';

const ActivationPage =(props)=>{
    const [values,setValues] = useState({
        token: props.match.params.token,
        message: ''
    })
    const activate = () => {
        //send token to API
        try{
            axios({
                method: 'POST',
                url: '/api/activate',
                data: {token:values.token}
            })

            //test axios request for success
            setValues(values.message='post request sent to api')
            console.log(values.message)

            //redirect to a dashboard, signed in
            window.location = "/login";

        }catch(e){
            console.log('there was problem connecting to api')
            //redirect to an error page
            
        }
        
    }
    return(
        <Layout>
            <h1>Activation Page</h1>
            <button onClick={activate}>Click here to activate account</button>
        </Layout>
        
    )
}

export default ActivationPage;