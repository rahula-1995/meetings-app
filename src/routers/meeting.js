const express = require("express");
const router = new express.Router();
const Meeting = require("../models/meeting");
const auth = require("../middleware/auth");

router.get("/meetings" ,auth,  async (req, res)=>{

    try{
       const userId = req.user._id;
       const meetings = await Meeting.find({});
       res.send(meetings);
    }catch(error){
        res.statusCode = 500;
        res.send(error.message);
    }
});

router.get("/meetings/:id",auth ,async (req, res)=>{
    const _id = req.params.id;
    try{
        const meeting = await Meeting.findById(_id);
        if(!meeting){
            return res.status(404).send();
        }
        res.send(meeting);
    }catch(error){
        res.statusCode = 500;
        res.send(error.message);
    }
}); 

router.post("/meetings" ,auth, async (req, res)=>{
    const meeting = new Meeting({...req.body, creator:req.user._id});
    try{
       await meeting.save();
       res.send(meeting);
    }catch(error){
        res.statusCode = 400 ;
        res.send(error.message);
    }
})

router.patch("/meetings/:id",auth, async (req, res)=>{
    const allowedUpdates = ['description', 'startHour' , 'startMin' , 'endHour', 'endMin' , 'dateOfMeeting' , 'emails'];
    const updates = Object.keys(req.body);

    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update);
    });

    if(!isValidOperation){
        return res.status(400).send({error:{message:"Invalid Operation"}});
    }

    try{
        const meeting = await Meeting.findOne({_id:req.params.id, creator:req.user._id});
        
       // const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true});
        if(!meeting){
            return res.status(404).send();
        }
        updates.forEach((update)=>{
            meeting[update] = req.body[update]
        })
        await meeting.save();
        res.json(meeting)
    }catch(error){
        res.statusCode = 400;
        res.send(error.message);
    }
});

router.delete("/meetings/:id",auth, async(req, res)=>{
    try{
        const meeting = await Meeting.findOneAndDelete({_id:req.params.id , creator:req.user._id});
        if(!meeting){
            return res.status(404).send();
        }
        res.send(meeting);
    }catch(error){
        res.statusCode = 400;
        res.send(error.message);
    }
});
module.exports = router;
