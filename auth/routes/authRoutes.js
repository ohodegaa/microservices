const express = require("express");
const router = express.Router(express);
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../db/user");
const Group = require("../db/group");


router.get("/me", (req, res) => {
    // uses a promise to better error handling and response to client
    new Promise((resolve) => {
        let bearerToken = req.headers["authorization"];
        if (typeof bearerToken === "undefined" || !bearerToken.split(" ")[1]) {
            // no token is provided
            throw {
                status: 401,
                message: "No token provided. Please provide a valid jwt token."
            }
        }
        resolve(bearerToken.split(" ")[1]);
    })
        .then(token => {
            return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                // adding a custom error, for preventing 500 status code
                if (err) {
                    throw {
                        status: 401,
                        message: "Not a valid token. Please provide a valid token"
                    }
                }
                return decoded;
            })
        })
        .then(decoded => {
            // finds user and deselects password for security reasons
            return User.findById(decoded.id)
            // .select("username email name ...")
            // select/deselect fields which should be returned in response body
                .exec()
        })
        .then(user => {
            if (!user) {
                // user not found
                throw {
                    status: 401,
                    message: "No user found for given token"
                }
            }

            return Group.find({
                _id: {
                    $in: user.groups
                }
            })
                .select("name")
                .exec()
        })
        .then(groups => {
            let groupNames = groups.map(group => group.name).join(" ");
            // sets header for further authorization on api
            console.log("User authenticated");
            res.set("x-groups", groupNames);
            res.status(200).send({
                auth: true,
            });

        })
        .catch(err => {
            // catches all errors (all errors regarding authentication is considered as 401 status codes)
            res.status(err.status || 500).json({
                error: {
                    message: "Error authenticating the user",
                    description: err.message || err,
                }
            })
        });
})

router.post("/login", (req, res) => {

    User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]})
        .select("+password")
        .exec()
        .then(user => {
            // check if user exist
            if (!user) {
                throw {
                    status: 401,
                    message: "No user found with username/email " + (req.body.username || req.body.email),
                }
            }
            return user;
        })
        .then(user => {
            // check if password is correct and return token
            return bcrypt.compare(req.body.password, user.password)
                .then(isValid => {
                    if (!isValid) {
                        throw {
                            status: 401,
                            message: "Password is incorrect. Please provide a valid password."
                        }
                    }
                    return jwt.sign({id: user._id}, process.env.JWT_SECRET);
                })
        })
        .then(token => {
            // send token
            res.status(200).send({auth: true, token});
        })
        .catch(err => {
            res.status(err.status || 500).json({
                error: {
                    message: "Error logging in the user",   // basically which endpoint action that gave an error
                    description: err.message || err,        // a description on what went wrong
                }
            });
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
            });
            return user.save();
        })
        .then(savedUser => {
            let token = jwt.sign({id: savedUser._id}, process.env.JWT_SECRET);
            res.status(201).send({
                user: savedUser.getSafe(),      // prevents returning i.e. password field
                token
            });
        })
        .catch(err => {
            return res.status(err.status || 500).json({
                error: {
                    message: "Error creating new user",
                    description: err.message || err,
                }
            })
        })
})

module.exports = authRouter = router;