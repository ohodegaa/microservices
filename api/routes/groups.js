const express = require("express");
const router = express.Router(express);
const mongoose = require("mongoose");
const Group = require("../models/Users/group");


router.get("/", (req, res, next) => {
    const query = {name, id} = req.query;
    Group.find(query)
        .exec()
        .then(docs => {
            let response = {
                count: docs.length,
                groups: docs,
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
    Group.find({name: req.body.name})
        .exec()
        .then(groups => {
            if (groups.length > 0) {
                throw {
                    status: 400,
                    message: "Already a group with that name"
                }
            } else {
                const group = new Group({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                });
                return group.save()
            }
        })
        .then(group => {
            res.status(200).json({
                message: "Created group successfully",
                createdGroup: group,
            })
        })
        .catch(err => {
            res.status(err.status || 500).json({
                error: {
                    message: "Could not create group",
                    description: err.message || err,
                }
            })
        });

});


router.get("/:groupId", (req, res, next) => {
    const id = req.params.groupId;
    Group.findOne({_id: id})
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

router.patch("/:groupId", (req, res, next) => {
    const id = req.params.groupId;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.name] = ops.value;
    }
    Group.update({_id: id}, {$set: updateOps})
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


router.delete("/:groupId", (req, res, next) => {
    const id = req.params.groupId;
    Group.remove({_id: id})
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