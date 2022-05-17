const express = require('express');
const user = require('../models/user');
const bcrypt = require('bcrypt');

exports.postLogin = async(req , res)=>{
        try{
            const User = await user.findByCredentials(req.body.username , req.body.password);
            const token = User.generateAuthToken();

            res.cookie("jwttoken" , token , {
                expires: new Date(Date.now() + 25892000000)
            })

            if(User.status!=="Active"){
                return res.status(200).send({
                    message:"Pending Account. Please verify your email"
                })
            }
            else{
                res.status(200).send({User , token});
            }
        }
        catch(e){
            res.status(401).send(e);
        }
    }