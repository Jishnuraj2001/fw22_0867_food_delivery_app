const express=require("express");
const orderRouter=express.Router();

const{Ordermodel}=require("../models/order.model");


orderRouter.post("/orders",async(req,res)=>{
    const obj=req.body;
    try {
        const order=new Ordermodel(obj);
        await order.save();
        res.status(201).json({"msg":"new order created successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"unable to create order"});
    }
})


orderRouter.get("/orders/:id",async(req,res)=>{
    const id=req.params.id;
    try {
        const order=await Ordermodel.findOne({_id:id});
        if(order){
            res.status(200).json({"msg":"got data successfully","data":order});
        }else{
            res.status(404).json({"msg":"unable to create order,there is no such order placed"});
        }
        
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"unable to get order"});
    }
})


module.exports={
    orderRouter
}