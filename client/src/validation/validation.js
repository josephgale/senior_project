import EmailValidator from 'email-validator';
import axios from 'axios';


export const ValidateFields=(values,setValues)=>{
    //for updating account info, get local storage so no error if localstorage==currentEmail
    const user = localStorage.getItem('user')
    const currentEmail = JSON.parse(user).email
    
    //firstName
    //set !user because first/last name got combined after this validation was created
    if(!values.firstName&&(!user)){
        setValues(values=>({...values,errors:{...values.errors,firstName:"Please provide a first name"}}))
    }else{
        setValues(values=>({...values,errors:{...values.errors,firstName:""}}))
    }

    //lastName
    //set !user because first/last name got combined after this validation was created
    if(!values.lastName&&(!user)){
        setValues(values=>({...values,errors:{...values.errors,lastName:"Please provide a last name"}}))
    }else{
        setValues(values=>({...values,errors:{...values.errors,lastName:""}}))
    }

    //email
    if(!values.email){
        setValues(values=>({...values,errors:{...values.errors,email:"Please provide a valid email address"}}))
    }else{
         setValues(values=>({...values,errors:{...values.errors,email:""}}))
    }


    //check if email already exists in database
    axios({
        method: 'post',
        url: '/api/checkEmail',
        data:{
            email:values.email
        }
    })
    .then((res)=>{
        if(res.data.emailFound&&(currentEmail!=values.email)){
            setValues(values=>({...values,errors:{...values.errors,emailFound:'You cannot use this address'}})) 
        }else{
            setValues(values=>({...values,errors:{...values.errors,emailFound:''}}))  
        }})
    .catch((e)=>{console.log('There was a problem processing AJAX request')})


    if(!EmailValidator.validate(values.email)){
        setValues(values=>({...values,errors:{...values.errors,email:'Please enter a valid email address'}}))
    }

    //password1
    if(!values.password1){
        setValues(values=>({...values,errors:{...values.errors,password1:"Please provide a password"}}))
    }else{
            setValues(values=>({...values,errors:{...values.errors,password1:""}}))
    }

    let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    if(!re.test(values.password1)){
        setValues(values=>({...values,errors:{...values.errors,password1:"Password must have one capital letter, one lowercase, one digit, one special character, and be 8 characters or more"}}))
    }else{
            setValues(values=>({...values,errors:{...values.errors,password1:""}}))
    }

    //password2
    if(!values.password2){
    setValues(values=>({...values,errors:{...values.errors,password2:"Please retype your password"}}))
    }else{
        setValues(values=>({...values,errors:{...values.errors,password2:""}}))
    }

    if(values.password1!==values.password2){
        setValues(values=>({...values,errors:{...values.errors,matchPasswords:"Passwords must match"}}))
       }else{
            setValues(values=>({...values,errors:{...values.errors,matchPasswords:""}}))
        }

}
