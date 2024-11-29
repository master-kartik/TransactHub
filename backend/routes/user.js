const express = require("express");
const userRouter = express.Router();
const zod = require("zod");
const {User} = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_SECRET}=require("../config");

const signupBody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
})

userRouter.post("/signup",async(req,res)=>{
    const{sucess} = signupBody.safeParse(req.body)
    if(!sucess){
        return res.status(411).json({
            message: "email already taken/ incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username: req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            message: "email already taken/ incorrect inputs"
        })
    }
    const user = await User.create({
        username : req.body.username,
        password : req.body.password,
        firstname : req.body.firstname,
        lastname : req.body.lastname,
    })
})
const userId =  user._id;

const token =jwt.sign({
    userId
},JWT_SECRET)

res.json({
    message: "user created",
    token: token
})

const signinBody = zod.object({
    username:zod.string().email(),
    password: zod.string()
})

userRouter.post("/signin",async(req,res)=>{
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "email already taken/ incorrect inputs"
        })
    }
    const user = User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)
        res.json({
            token: token
        })
        return;
    }
    res.status(411).json({
        message: "error occured while logging in"
    })
})

module.exports = userRouter;