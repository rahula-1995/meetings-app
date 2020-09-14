const express = require("express");
const cors = require('cors');
const app = express();
require("./db/mongoose");
const User = require("./models/user");
const Meeting = require("./models/meeting");
const userRouter = require("./routers/user.js");
const meetingRouter = require("./routers/meeting");
const auth = require("./middleware/auth");
const jwt = require("jsonwebtoken");

app.use(cors());

const PORT = process.env.PORT

//middleware
// app.use((req, res, next)=>{
//     if(req.method === 'GET'){
//         res.send("Get req are diabled");
//     }else{
//         next();
//     }
    
// })

// app.use((req, res, next)=>{
//     res.status(503).send("Maintenence Mode")
// })
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.set('view engine', 'ejs');

app.get("/", async(req, res)=>{
    res.render("login")
})

app.get("/private" , async(req, res)=>{
    const authorizationHeader = req.get('Authorization');
    
    if(authorizationHeader){
        const token = authorizationHeader.replace('Bearer ' , '');
        const decoded = await jwt.verify(token , process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id , 'tokens.token' : token});
        if(!user){
            res.redirect("/");
        }
        res.render('private', {user:user});
    }
    else{
        res.json({error:"Not Authorized"});
    }

});
app.use(userRouter);
app.use(meetingRouter);


app.listen(PORT, ()=>{
    console.log(`Listening on ${PORT}`);
})

//const bcrypt = require("bcryptjs");

// const myFunction  = async ()=>{
//     const password = "harry123";
//     const hashedPassword  = await bcrypt.hash(password, 8)
//     console.log(password, ";", hashedPassword);
//     const isMatch = await bcrypt.compare("harry123" , hashedPassword);
//     console.log(isMatch);
// }

// myFunction();

// const jwt = require("jsonwebtoken");

// const myFunction = ()=>{
//     const token = jwt.sign({_id:'abc123'}, 'Harry', {expiresIn:'7 days'});
//     console.log(token);
//     const data = jwt.verify(token, "Harry");
//     console.log(data);
// }

// myFunction()

// const main= async ()=>{
//     const meeting = await Meeting.findById("5f5e60862af394995d124512")
//     await meeting.populate('creator').execPopulate()
//     console.log(meeting);
//     const user = await User.findById("5f5ded2d926ba58d75390f08");
//     await user.populate('meetings').execPopulate()
//     console.log(user.meetings);
// }
// main()