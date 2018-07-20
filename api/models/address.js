const mongoose = require("mongoose");



const addressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ADRESSEID: Number,
    TYPE: String,
    KOMMUNENR: Number,
    ADRESSEKODE: String,
    ADRESSENAVN: String,
    KORTADRESSENAVN: String,
    NR: String,
    BOKSTAV: String,
    GARDSNR: Number,
    BRUKSNR: Number,
    FESTENR: Number,
    SEKSJONSNR: Number,
    UNDERNR: String,
    KORTADRESSETILLEGGSNAVN: String,
    TILLEGGSNAVNKILDEKODE: String,
    TILLEGGSNAVNKILDENAVN: String,
    KOORDINATSYSTEMKODE: Number,
    NORD: Number,
    OST: Number,
    GRUNNKRETSNR: Number,
    GRUNNKRETSNAVN: String,
    KIRKESOGNNR: Number,
    KIRKESOGNNAVN: String,
    TETTSTEDNR: String,
    TETTSTEDNAVN: String,
    VALGKRETSNR: Number,
    VALGKRETSNAVN: String,
    POSTNUMMER: Number,
    POSTNUMMEROMRADE: String,
});


module.exports = mongoose.model("Address", addressSchema);