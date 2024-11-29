const express = require("express");
const userRouter = express.Router();
const zod = require("zod");
const {User} = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
import authMiddleware from "../middleware"

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
const updateBody = zod.object({
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
    password: zod.string().optional()
})

userRouter.put('/user',authMiddleware,async(req,res)=>{
    const {success} = updateBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Invalid Data Quality"
        })
    }
    await User.updateOne({_id:req.userId},req.body)
    res.status(200).json({
        message: "Updated Successfully"
    })
})
userRouter.get('/bulk',async(req,res)=>{
    const filter = req.query.filter || '';
    const users = await User.find({
       $or: [{firstName:{
            $regex : filter
        },
        lastName:{
            $regex : filter
        }}]
    })
res.json({
   user: users.map(user =>({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id
   }))
})
})


module.exports = userRouter;