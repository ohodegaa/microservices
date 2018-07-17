const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = express();
const User = require("./db/user");


console.log(process.env.MONGO_ATLAS_PW);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


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


app.get("/me", (req, res) => {
    let bearerToken = req.headers["authorization"];
    let token = bearerToken.split(" ")[1];

    if (!token) {
        return res.status(401).send({
            auth: false,
            message: "No token provided",
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("token error\n" + err);
            return res.status(500).send({
                auth: false,
                message: "Failed to authenticate token.\n " + err,
            })
        }
        User.findById(decoded.id,
            {password: 0},
            (err, user) => {
            if (err) {
                console.log("User error\n" + err);
                return res.status(500).send("There was a problem finding the user");
            }
            if (!user) {
                console.log("User not found\n");
                return res.status(404).send("No user found");
            }
            res.status(200).send(user);
        })
    })
});

app.post("/login", (req, res) => {
    let hashedPasswd = bcrypt.hashSync(req.body.password, 8);
    User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, user) => {
        if (err) return res.status(500).send("Error occured when fetching the user from db");
        if (!user) return res.status(404).send("No user found.");

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                auth: false,
                token: null,
            })
        }
        let token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.status(200).send({auth: true, token});
    });

})


app.post("/register", (req, res) => {
    let hashedPasswd = bcrypt.hashSync(req.body.password, 8);
    User.find({$or: [{email: req.body.email}, {username: req.body.username}]}, (err, users) => {

        if (users.length > 0) {
            res.status(401).send("Already a user with that username and/ord email");
        } else {
            User.create({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hashedPasswd,
                name: req.body.name,
                email: req.body.email,
            }, (err, user) => {
                if (err) {
                    res.status(500).send("There was a problem registering the user.\n" + err);
                } else {
                    let token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
                        expiresIn: 86400,
                    });
                    res.status(200).send({auth: true, token});
                }
            })
        }

    });

})


app.listen(4040, () => console.log("Auth server running on port 4040"));