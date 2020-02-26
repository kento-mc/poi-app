'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const categorySchema = new Schema({
    name: String
}, { collection: 'categories' }); // give custom name to collection in the DB

module.exports = Mongoose.model('Category', categorySchema);