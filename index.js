const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.router");
const { restaurantRouter } = require("./routes/restaurant.router");
const {orderRouter}=require("./routes/order.router");

app.get("/", (req, res) => {
    res.status(200).send("Basic API Endpoint");
})

app.use("/api", userRouter);
app.use("/api", restaurantRouter);
app.use("/api",orderRouter);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log("Connected to MongoDB");
        console.log(`Server running at http://localhost:${process.env.port}`);
    } catch (error) {
        console.log(error.message);
        console.log("Connection failed");
    }
})