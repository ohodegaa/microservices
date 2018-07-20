const mongoose = require("mongoose");
const User = require("../models/Users/user");
const Group = require("../models/Users/group");


permit = (...allowed) => {
    const isAllowed = (_groups) => {
        return Group.find({
            _id: {
                $in: _groups,
            }
        }, {name: 1})
            .then(groups => {
                groups.forEach(group => {
                    if (allowed.includes(group.name)) {
                        return true;
                    }
                });
                return false;
            })
            .catch(() => {
                return false;
            })
    }


    return (req, res, next) => {
        if (req.headers["x-user"] && req.groups && isAllowed(req.groups)) {
            next();
        } else {
            res.status(401).json({
                error: {
                    message: "Not authorized. Missing group privileges",
                }
            })
        }
    }
}


getGroups = (req, res, next) => {
    if (typeof req.headers["x-user"] === "undefined") next();

    User.findOne({_id: req.headers["x-user"]}, {
        groups: 1
    })
        .exec()
        .then(user => {
            req.groups = user.groups;
            next();
        })
        .catch(err => {
            res.status(500).json({message: "Server error setting groups to request."})
            next();
        })

}

module.exports = {
    permit,
    getGroups
};