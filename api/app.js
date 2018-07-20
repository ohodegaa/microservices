const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const addressRoutes = require("./routes/adresses");
const userRoutes = require("./routes/users");
const groupRoutes = require("./routes/groups");

const getGroup = require("./utils/authorization");

const app = express();

mongoose.connect(
        "mongodb://olehakon95:" +
        process.env.MONGO_ATLAS_PW +
        "@microservices-shard-00-00-qsbhj.mongodb.net:27017,microservices-shard-00-01-qsbhj.mongodb.net:27017,microservices-shard-00-02-qsbhj.mongodb.net:27017/test?ssl=true&replicaSet=Microservices-shard-0&authSource=admin&retryWrites=true",
    );


app.use(morgan("dev"));
app.use(bodyParser.json());


// for preventing CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-User"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

app.use("/api/addresses", addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);

// not found error (404)
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


// handles all errors in our api
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(err);
    res.json({
        errorFinal: {
            message: err.message,
        }
    })
})



module.exports = app;