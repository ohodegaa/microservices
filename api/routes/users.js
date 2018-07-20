const express = require("express");
const router = express.Router(express);
const mongoose = require("mongoose");
const User = require("../models/Users/user");

const {permit, getGroups} = require("../utils/authorization");


router.use(getGroups);


router.get("/", permit("admin", "employees"), (req, res, next) => {
    console.log("Groups: " + req.groups);
    const query = {username, name, email} = req.query;
    console.log(query);
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


router.post("/", permit("employees"), (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        groups: req.body.groups,
    });
    user.save()
        .then(result => {
            res.status(200).json({
                message: "Created User successfully",
                createdUser: user,
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            })
        });
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
            console.log(err);
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