const express = require('express');
const router = express.Router();
const User = require('../models/user')
//controllers
const {signup,activate,pwResetRequest,pwReset,googleLogin,
    login,newLesson,getLessons,updateLesson,deleteLesson,
    getEnrollmentOptions,enroll,getEnrolledLessons,
    getLessonById,nextQuestion,getEnrolledStudents,
    updateAccountInfo,deleteAccount,deleteEnrollment} 
    = require('../controllers/auth')

router.post('/signup',signup);
router.post('/activate',activate);
router.post('/pwResetRequest',pwResetRequest);
router.post('/pwReset',pwReset);
router.post('/google-login',googleLogin)
router.post('/login',login) 
router.post('/getLessons',getLessons)
router.post('/newLesson',newLesson)
router.post('/updateLesson',updateLesson)
router.post('/deleteLesson',deleteLesson)
router.post('/getEnrollmentOptions',getEnrollmentOptions)
router.post('/getEnrolledLessons',getEnrolledLessons)
router.post('/enroll',enroll)
router.post('/getLessonById',getLessonById)
router.post('/nextQuestion',nextQuestion)
router.post('/getEnrolledStudents',getEnrolledStudents)
router.post('/updateAccountInfo',updateAccountInfo)
router.post('/deleteAccount',deleteAccount)
router.post('/deleteEnrollment',deleteEnrollment)


module.exports = router