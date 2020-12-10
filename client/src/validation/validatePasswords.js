/*This function does the following: 
1. validates whether passwords match 
2. validates whether passwords meet requirements

*This function is used by pwresetpage.js
*/

const ValidatePasswords = (values,setValues) => {  
    //validate that passwords match criteria
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
export default ValidatePasswords
