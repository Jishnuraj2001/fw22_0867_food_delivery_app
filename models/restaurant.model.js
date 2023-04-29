const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const restaurantSchema = mongoose.Schema({
    name: String,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    menu: [{
        _id:String,
        name: String,
        description: String,
        price: Number,
        image: String
    }]
});

const Restaurantmodel = mongoose.model("restaurant", restaurantSchema);

module.exports = {
    Restaurantmodel
}