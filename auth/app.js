const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

const authRouter = require("./routes/authRoutes");

mongoose.connect(
    "mongodb://olehakon95:" +
    process.env.MONGO_ATLAS_PW +
    "@microservices-shard-00-00-qsbhj.mongodb.net:27017,microservices-shard-00-01-qsbhj.mongodb.net:27017,microservices-shard-00-02-qsbhj.mongodb.net:27017/test?ssl=true&replicaSet=Microservices-shard-0&authSource=admin&retryWrites=true",
)
    .then(() => {
            console.log("Database running...");
        },
        err => {
            console.log("Could not connect to database...\n" + err)
        }
    );


console.log(process.env.MONGO_ATLAS_PW);
app.use(bodyParser.urlencoded({extended: false}));
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


app.use("/auth", authRouter);

// not found error (404)
app.use((req, res, next) => {
    const error = new Error("No path found");
    error.status = 404;
    next(error);
});


// handles all errors in our api
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        }
    })
})






module.exports = app;