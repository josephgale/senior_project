import React from 'react'
import {useHistory} from 'react-router-dom'

const Logout = () => {
    console.log('Logout requested')
    const history = useHistory()
    history.push("/login")

    if(1>4){
        return(
            null
        )
    }else{
        return(
            <h1>You made it here</h1>
        )
    }

}


export default Logout