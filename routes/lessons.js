const express = require('express');
const router = express.Router();
const Lesson = require('../models/user');

//create lesson
router.post('/lessons',async (req,res)=>{
    const lesson = new Lesson(req.body);
    try {
        await lesson.save();
        res.status(200).send(lesson)
    } catch(e) {
        res.status(500).send(e)
    }
    // lesson.save().then(()=>{
    //     res.status(200).send(lesson)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // });     
});

//get all lessons
router.get('/lessons',async (req,res)=>{
    try{
        const lessons = await Lesson.find({})
        res.status(200).send(lessons);
    }catch(e){
        res.status(500).send(e)
    }
    // Lesson.find({}).then((result)=>{
    //     res.send(result)
    // }).catch((e)=>{
    //     res.status(400).send()
    // });
})

//get lessons by id
router.get('/lessons/:id', async (req,res)=>{
    const _id = req.params.id;
    try{
        const lesson = await Lesson.findById(_id);
        if(!lesson){
            res.status(400).send("No lesson found")
        }
        res.status(200).send(lesson);

    }catch(e){
        res.status(500).send(e);
    };
    // Lesson.findById(_id).then((result)=>{
    //     if(!result){
    //         res.status(400).send("No lesson found")
    //     }
    //     res.send(result)
    // }).catch((e)=>{
    //     res.status(500).send()
    // });
})

//update lesson by id
router.patch('/lessons/:id', async (req,res)=>{
    //validate againts updating things that shouldn't be updated
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name","question","answer"]
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(404).send("You can't update that item")
    }
    try{
        //const lesson = await Lesson.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        const lesson = await Lesson.findById(req.params.id)
        updates.forEach((update)=>lesson[update]=req.body[update])
        await lesson.save()

        if(!lesson){
            res.status(404).send("Could not find lesson")
        }
        res.status(200).send(lesson)
    }catch(e){
        res.status(500).send(e)
    }
})

//delete lesson by id: 
router.delete('/lessons/:id',async(req,res)=>{
    try{
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if(!lesson){
            res.status(404).send("Lesson not found")
        }
        res.status(200).send(lesson)
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router