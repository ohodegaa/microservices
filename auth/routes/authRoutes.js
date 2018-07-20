const express = require("express");
const router = express.Router(express);
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../db/user");

router.get("/me", (req, res) => {
    let bearerToken = req.headers["authorization"];
    if (typeof bearerToken === "undefined") {
        return res.status(401).send({
            auth: false,
            message: "No token provided",
        });
    }
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
            return res.status(401).send({
                auth: false,
                message: "Failed to authenticate token.\n " + err,
            })
        }
        User.findById(decoded.id)
            .select("-password")
            .exec((err, user) => {
                if (err) {
                    console.log("User error\n" + err);
                    return res.status(401).send("There was a problem finding the user");
                }
                if (!user) {
                    console.log("User not found\n");
                    return res.status(401).send("No user found");
                }
                console.log("User " + user._id + " authorized...");
                res.set("X-User", user._id);
                res.status(200).send({
                    auth: true,
                    user
                });
            })
    })
});

router.post("/login", (req, res, next) => {

    User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]})
        .exec()
        .then(user => {
            if (!user) {
                res.status(404).send("No user found.");
            }
            else return user;
        })
        .catch(err => {
            console.log("error when fetching from db")
            res.status(500).json({
                error: {
                    message: "Error occured when fetching the user from db",
                    description: err,
                }
            })
        })
        .then(user => {
            let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                console.log("Password not valid for username " + user.username);
                res.status(401).json({
                    auth: false,
                    token: null,
                    message: "Not a valid password",
                })
            }
            let token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            console.log("User " + user._id + " logged in...")
            res.status(200).send({auth: true, token});
        })

});


router.post("/register", (req, res) => {

    User.find({$or: [{email: req.body.email}, {username: req.body.username}]})
        .exec()
        .then(users => {
            if (users.length <= 0) {
                return bcrypt.hash(req.body.password, 8)
            } else {
                throw {
                    status: 400,
                    message: "A user has already been registered with that username and/or email. Please try another username/email",
                };
            }
        })
        .then(hash => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash,
                name: req.body.name,
                email: req.body.email,
                groups: req.body.groups,
            })
            return user.save();
        })
        .then(savedUser => {
            let token = jwt.sign(
                {id: savedUser._id},
                process.env.JWT_SECRET,
                {expiresIn: 86400}
            );
            return res.status(201).send({
                created: true,
                user: savedUser.getSafe(),
                token
            });
        })
        .then(obj => console.log(obj))
        .catch(err => {
            console.log(err);
            return res.status(err.status || 500).json({
                error: {
                    message: "Error when creating new user",
                    description: err.message || {...err},
                }
            })
        })
})

module.exports = authRouter = router;