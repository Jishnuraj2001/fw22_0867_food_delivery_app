const express = require("express");
const restaurantRouter = express.Router();

const { Restaurantmodel } = require("../models/restaurant.model");
const { authenticator } = require("../middlewares/authenticator.middleware");


restaurantRouter.post("/restaurants",authenticator,async(req,res)=>{
    const{name,address,menu}=req.body;
    try {
        const restaurant=new Restaurantmodel({name,address,menu});
        await restaurant.save();
        res.status(201).json({"msg":"new restaurant created successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"somthing went wrong,unable to create new restaurant","err":error.message});
    }
})


restaurantRouter.get("/restaurants",async(req,res)=>{
    try {
        const data=await Restaurantmodel.find();
        if(data.length!=0){
            res.status(200).json({"msg":"got all the restaurant data successfully.","data":data});
        }else{
            res.status(404).json({"msg":"No  restaurant data present in database."});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"somthing went wrong,unable to get all restaurant data","err":error.message});        
    }
})


restaurantRouter.get("/restaurants/:id",async(req,res)=>{
    const id=req.params.id;
    try {
        const restaurant=await Restaurantmodel.findOne({_id:id});
        if(restaurant){
            res.status(200).json({"msg":"got  restaurant data successfully.","data":restaurant});
        }else{
            res.status(404).json({"msg":`No  restaurant data with id:${id} present in database.`});
        }     
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"somthing went wrong,unable to get restaurant data","err":error.message});     
    }
})


restaurantRouter.get("/restaurants/:id/menu",async(req,res)=>{
    const id=req.params.id;
    try {
        const restaurant=await Restaurantmodel.findOne({_id:id});
        if(restaurant){
            const menu=restaurant.menu;
            if(menu.length!=0){
                res.status(200).json({"msg":`entire menu off restaurant with id :${id}.`,"data":menu});
            }else{
                res.status(404).json({"msg":`No  menu is present for restaurant with id:${id} in database.`});
            }
        }else{
            res.status(404).json({"msg":`No  data is present for restaurant with id:${id} in database.`});
        }     
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"somthing went wrong,unable to get restaurant data","err":error.message});     
    }
})



restaurantRouter.post("/restaurants/:id/menu",authenticator,async(req,res)=>{
    const id=req.params.id;
    const {name,description,price,image}=req.body;
    try {
        const restaurant=await Restaurantmodel.findOne({_id:id});
        if(restaurant){
            const menu=restaurant.menu;
            menu.push({name,description,price,image,_id:`${id}${Math.floor(price*Math.random()*111)}${name}${Math.floor(Math.random()*4444)}`});
            await Restaurantmodel.findByIdAndUpdate({_id:id},{menu:menu});
            res.status(201).json({"msg":`added new Menu item to restaurant with id :${id}`})
        }else{
            res.status(404).json({"msg":`No  data is present for restaurant with id:${id} in database.`});
        }     
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"somthing went wrong,unable to get restaurant data","err":error.message});     
    }
})


restaurantRouter.delete("/restaurants/:Id/menu/:id",authenticator,async(req,res)=>{
    const Id=req.params.Id;
    const id=req.params.id;
    try {
        const restaurant=await Restaurantmodel.findOne({_id:Id});
        if(restaurant){
            const menu=restaurant.menu;
            const newMenu=menu.filter(item=>item._id!=id);
            await Restaurantmodel.findByIdAndUpdate({_id:Id},{menu:newMenu});
            res.status(202).json({"msg":`deleted Menu item with id:${id} from restaurant with id :${Id}`})
        }else{
            res.status(404).json({"msg":`No  data is present for restaurant with id:${id} in database.`});
        }  
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"somthing went wrong,unable to delete menu data","err":error.message});     
    }

})





module.exports = {
    restaurantRouter
}