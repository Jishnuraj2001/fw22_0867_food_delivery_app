const express=require("express");
const userRouter=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();

const{Usermodel}=require("../models/user.model");

userRouter.post("/register",async(req,res)=>{
    const {name,email,password,address}=req.body;
    try {
       const checker=await Usermodel.findOne({email});
       if(checker){
        res.status(200).json({"msg":"this email is already registrated,Please try another one"});
       }else{
        bcrypt.hash(password,7,async(err, hash)=>{
            if(hash){
                const user=new Usermodel({name,email,password:hash,address});
                await user.save();
                res.status(201).json({"msg":"registration successful."});
            }else{
                console.log(err.message);
                res.status(404).json({"msg":"something went wrong,unable to register","err":err.message});
            }
        });
       }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"something went wrong,unable to register","err":error.message});
    }
})


userRouter.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    try {
        const user=await Usermodel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err, result)=>{
                if(result == true){
                    const token=jwt.sign({ userID:user._id },process.env.key);
                    res.status(201).json({"msg":"Login successful","token":token});
                }else{
                    res.status(404).json({"msg":"Wrong credentials,Please enter valid password"});
                }
            });
        }else{
            res.status(404).json({"msg":"Wrong credentials,unable to find the user,please enter already registrated email"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"something went wrong,unable to login","err":error.message});
    }
})


userRouter.patch("/user/:id/reset",async(req,res)=>{
    const{cur_password,new_password}=req.body;
    const id=req.params.id;
    try {
        const user=await Usermodel.findOne({_id:id});
        if(user){
            bcrypt.compare(cur_password,user.password,(err, result)=>{
                if(result == true){
                    bcrypt.hash(new_password,7,async(err, hash)=>{
                        if(hash){
                            await Usermodel.findByIdAndUpdate({_id:id},{password:hash});
                            res.status(204).json({"msg":"Password Updated Successfully."});
                        }else{
                            console.log(err.message);
                            res.status(404).json({"msg":"something went wrong,unable to register","err":err.message});
                        }
                    });
                }else{
                    res.status(404).json({"msg":"Wrong credentials,Please enter valid password"});
                }
            });  
        }else{
            res.status(404).json({"msg":"unable to find the user"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"something went wrong,unable to change password","err":error.message});        
    }
})


module.exports={
    userRouter
}