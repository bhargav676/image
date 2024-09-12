// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    image: String
});

const Images = mongoose.model('Images', imageSchema);

module.exports = Images;
