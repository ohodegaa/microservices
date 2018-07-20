const mongoose = require("mongoose");


const excludedFromClient = ["password", "__v"];

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: {
        type: String,
        select: false, // should be deselected by default for security
    },
    name: String,
    email: String,
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }],
});


// set to exclude parameters when json is returned to client
// AWARE: only works if returning json tho
userSchema.methods.getSafe = function() {
    let obj = this.toObject();
    for (let ex of excludedFromClient) {
        delete obj[ex];
    }
    return obj
}


module.exports = mongoose.model("User", userSchema);