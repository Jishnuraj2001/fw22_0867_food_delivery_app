const { ObjectId } = require("bson");
const mongoose=require("mongoose");

const orderSchema=mongoose.Schema({
        user : { type: ObjectId, ref: 'User' },
        restaurant : { type: ObjectId, ref: 'Restaurant' },
      items: [{
        name: String,
        price: Number,
        quantity: Number
      }],
      totalPrice: Number,
      deliveryAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
      },
      status:{type:String,enum:["placed", "preparing", "on the way", "delivered"],default:"placed"}
})



const Ordermodel=mongoose.model("order",orderSchema);

module.exports={
    Ordermodel
}