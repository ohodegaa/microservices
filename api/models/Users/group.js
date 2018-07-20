const mongoose = require("mongoose");



const groupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
});


module.exports = mongoose.model("Group", groupSchema);