const express = require("express");
const cors = require('cors');
const app = express();
require("./db/mongoose");
const User = require("./models/user");
const Meeting = require("./models/meeting");
const userRouter = require("./routers/user.js");
const meetingRouter = require("./routers/meeting");

app.use(cors());

const PORT = process.env.PORT;

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

app.use(express.json());
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

