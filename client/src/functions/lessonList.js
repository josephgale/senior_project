import Axios from 'axios'



const getAllLessons = () => {
    //get user id from local storage
    const user = localStorage.getItem('user')
    const email = JSON.parse(user).email
    const allLessons = []
    Axios({
        method: 'POST',
        url: '/api/getLessons',
        data: {email}
    })
    .then((res)=>{
            //console.log('retreiving all lessons',res.data)
            Object.keys(res.data).forEach(key=>{
                allLessons.push(res.data[key].lessonName)
            })
            return allLessons
            
        })
    .catch((e)=>console.log('could not retrieve all lessons', e))
}

export default getAllLessons