const user = require('../models/user');
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user:'emailtestingid007@gmail.com',
        pass:'lpumqbiybammqxcz'
    }
})

exports.postSignup = async (req , res)=>{
    try{
        let User = await user.findOne({ email:req.body.email });
        const token = jwt.sign({ email:req.body.email } , config.secretCC);
        // const password = await bcrypt.hash(req.body.password , 8);
        if(User){
            return res.status(200).send("user already exists");
        }      
        User = await new user({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            phoneNumber:req.body.phoneNumber,
            age:req.body.age,
            confirmationCode:token
        });

        User.save().then(()=>{
            const confirmationCode  = token;
            const email = User.email;
            const data = ({
                from:"emailtestingid007@gmail.com",
                to:email,
                subject:"Verification Email",
                html:`<a href="http://localhost:5000/${confirmationCode}">click here to verify</a>`
            })
            transporter.sendMail(data , function(error , info){
                if(error){
                    res.send(error);
                    console.log(error);
                }
                else{
                    res.status(200).send('mail sent');
                    console.log(info)
                }
            });
        }).catch((e)=>{
            console.log(err);
            req.status(400).send(err);
        })
        // res.status(200).send(User); 
    }
    catch(error){
        res.status(401).send(error);
        console.log(error);
    }
}

exports.getConfirmation = async(req , res)=>{
   const User = user.findOne({
       confirmationCode:req.params.confirmationCode
   }).then((User)=>{
       if(!User){
        return res.status(400).send('user not found/the link has been deactivated');
       }
       User.status = 'Active';
       User.confirmationCode = null;
       res.status(200).send('verified successfully');

       User.save().then((err)=>{
           if(err){
               console.log(err);
           }
           else{
               console.log('status changed to active');
           }
       })
   }).catch((e)=>{
       res.status(500).send(e);
   })
}
