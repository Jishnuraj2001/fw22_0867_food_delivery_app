const jwt=require("jsonwebtoken");
require("dotenv").config();

async function authenticator(req,res,next){
    try {
        const token=req.headers.authorization;
        if(token){
            jwt.verify(token, process.env.key,(err, decoded)=>{
                if(decoded){
                    req.body.userID=decoded.userID;
                    next();
                }else{
                    res.status(404).json({"err":err.message});
                }
              });
        }else{
            res.send(404).json({"msg":"Please login first,token is not generated"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({"msg":"something went wrong in middleware","err":error.message});        
    }
}


module.exports={
    authenticator
}