const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

//Get Profile
router.get("/users/me" ,auth,  async (req, res)=>{
    res.send(req.user.getPublicProfile());
})

//Signup
router.post("/users", async (req, res)=>{
    const user = new User(req.body);

    try{
        
        await user.save();
        const token = await user.generateAuthToken();
        res.send({user: user.getPublicProfile(), token});

    }catch(error){
        res.status(400).send(error.message);

    }
    
})

//Login user
router.post("/users/login" , async(req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user: user.getPublicProfile(), token});
    }catch(error){
        res.status(400).send(error.message);
    }
})


//Logout
router.post("/users/logout" , auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>token.token !== req.token);
        await req.user.save();
        res.send();
    }
    catch(error){
        res.status(500).send();
    }

});


//Logout All
router.post("/users/logoutAll" , auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(error){
        res.status(500).send();
    }
});

//Update user
router.patch("/users/me" ,auth, async(req, res)=>{

    const _id  = req.user._id;
  //  ObjectId("5e24b318e791af44ea25e1a4")
    const updates = Object.keys(req.body);
    const validUpdates = ['name' , 'age' , 'email' , 'password'];
    const isValidUpdate = updates.every((update)=>{
            return validUpdates.includes(update);
    });
    if(!isValidUpdate){
        return res.status(404).send({error : "invlid update"});
    }
    try{ 
        const user = req.user;
        updates.forEach((update)=>{
            user[update] = req.body[update]; 
        });
        await user.save();

        //const user = await User.findByIdAndUpdate(_id , req.body , {new: true , runValidators : true});
        // if(!user){
        //     res.status(404).send();
        // }
        res.status(200).send({user:user.getPublicProfile()});
    }catch(error){
        res.status(500).send(error);
    }

});


//Delete User
router.delete("/users/me" ,auth,  async (req, res)=>{
    try{
        const user = await User.findByIdAndDelete(req.user._id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(error){
        res.statusCode = 400;
        res.send(error.message);
    }
});

module.exports = router;