const express = require("express");
const router = express.Router(express);
const mongoose = require("mongoose");
const Address = require("../models/address");


router.get("/", (req, res, next) => {
    Address.find({})
        .limit(100)
        .exec()
        .then(docs => {
            const keys = Object.keys(JSON.parse(JSON.stringify(docs[0])));
            let response = {
                count: docs.length,
                headers: keys,
                addresses: docs,
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        })
})


router.post("/", (req, res, next) => {
    const address = new Address({
        _id: new mongoose.Types.ObjectId(),
        TYPE: req.body.type,
        KOMMUNENR: req.body.kommunenr,
        ADRESSEKODE: req.body.adressekode,
        ADRESSENAVN: req.body.adressenavn,
    });
    address.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Created address successfully",
                createdAddress: address,
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        });
})


router.get("/:addressId", (req, res, next) => {
    const id = req.params.addressId;
    Address.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
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

router.patch("/:addressId", (req, res, next) => {
    const id = req.params.addressId;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.name.toUpperCase()] = ops.value;
    }
    Address.update({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        })
    ;
});


router.delete("/:addressId", (req, res, next) => {
    const id = req.params.addressId;
    Address.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            })
        })
})

module.exports = router;