const express = require("express");
const {Account} = require("../db");
const { authMiddleware } = require("../middleware");
const { default: mongoose } = require("mongoose");
const accountRouter = express.Router();

accountRouter.get('/balance',authMiddleware,async(req,res)=>{
    const account  =await Account.findOne({userId:req.userId});
    return res.json({
        balance: account.balance
    })
})
accountRouter.post('/transfer',authMiddleware,async(req,res)=>{
    const session = mongoose.startSession();
    (await session).startTransaction();

    const {amount,to} = req.body;
    const account = Account.findOne({userId:req.userId}).session(session);
    if(!account || account.balance < amount){
        (await session).abortTransaction();
        return res.status(400).json({
            message:"Insufficient Balance"
        })
    }
    const toAccount = Account.findOne({userId:to}).session(session);
    if(!toAccount){
        (await session).abortTransaction();
        return res.status(400).json({
            message: "'Invalid Account"
        })
    }

    await Account.findOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.findOne({userId:to},{$inc:{balance:amount}}).session(session);

    (await session).commitTransaction();
    return res.status(200).json({
        message: "Transaction Complete"
    })

})

module.exports={
    accountRouter
}