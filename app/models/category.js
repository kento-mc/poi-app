'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const catSchema = new Schema({
    name: String,
    description: String,
    contributor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'categories' }); // give custom name to collection in the DB

module.exports = Mongoose.model('Category', catSchema);