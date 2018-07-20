const express = require("express");
const router = express.Router(express);
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users/user");

const { permit } = require("../utils/authorization");


router.get("/", permit("admin", "employees"), (req, res, next) => {
    User.find()
        .select("_id username groups")
        .populate("groups", "_id name")
        .limit(100)
        .exec()
        .then(docs => {
            let response = {
                count: docs.length,
                users: docs,
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            })
        })
})


router.post("/", (req, res, next) => {
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


router.get("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.findOne({_id: id})
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: "No valid entry found for provided id " + id});
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            })
        })
})

router.patch("/:userId", (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.name] = ops.value;
    }
    User.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            })
        })
    ;
});


router.delete("/:userId", (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            })
        })
})

module.exports = router;