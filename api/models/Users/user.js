const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    email: String,
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }],
});


module.exports = mongoose.model("User", userSchema);