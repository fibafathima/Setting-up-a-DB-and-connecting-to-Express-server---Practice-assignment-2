const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const port = 3010;
const mongo = process.env.mongoURL;
const User = require('./schema')
app.use(express.json())
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
app.post("/api/user",async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    if (!name||!email||!password){
      res.status(400).json({error:"Please fill all the fields"})
    }
    const new_user=new User({name,email,password})
    await new_user.save();
    res.status(201).json({message:"User created successfully"})

  }catch(err){
    if (err.code===11000){
      res.status(400).json({message:"Email already exists"})
    }
    if (err.name==="ValidationError"){
      res.status(400).json({err:err.message})

    }
    console.err("server error",err)
    res.status(500).json({message:"Server error"})
  }
  
})

app.listen(port, async() => {
  try{
    await mongoose.connect(mongo)
    console.log("Connected to MongoDB")
    
  }catch(err){
    console.log(err)
  }
  console.log(`Example app listening at http://localhost:${port}`);
});


