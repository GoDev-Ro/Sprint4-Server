var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sprint4');

module.exports = mongoose.model('City', new mongoose.Schema({
    dev: String,
    name: String,
    visited: Number,
    stars: Number
}));