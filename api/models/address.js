const mongoose = require("mongoose");



const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    TYPE: String,
    KOMMUNENR: Number,
    ADRESSEKODE: String,
    ADRESSENAVN: String
})


module.exports = mongoose.model("Address", addressSchema);