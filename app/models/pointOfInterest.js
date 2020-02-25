'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
    name: String,
    description: String,
    categories: [String],
    imageURL: String,
    contributer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'pointsofinterest' }); // give custom name to collection in the DB

module.exports = Mongoose.model('PointOfInterest', poiSchema);