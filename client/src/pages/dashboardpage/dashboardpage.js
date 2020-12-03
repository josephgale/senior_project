import React from 'react';
import Layout from '../../components/layout'
import Teaching from '../../components/teaching'
import Enrollment from '../../components/enrollment'
// const sdk = require("microsoft-cognitiveservices-speech-sdk");
// const speechConfig = sdk.SpeechConfig.fromSubscription("e1f8581561cb4f75a9da97c1bcdba067", "eastus");



const Dashboard = () => {
    // let micInput
    // function fromMic() {
    //     let audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    //     let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        
    //     console.log('Speak into your microphone.');
    //     recognizer.recognizeOnceAsync(result => {
    //         console.log(`RECOGNIZED: Text=${result.text}`);
    //         micInput = result.text
    //         console.log(micInput)
    //     });
    // }
    return(
        <Layout>  
            <h1>Dashboard Page</h1>
            <hr></hr> 

            <Teaching />  
            <hr></hr>

            <Enrollment />               
            <hr></hr>
        </Layout>
        
    )
}

export default Dashboard;