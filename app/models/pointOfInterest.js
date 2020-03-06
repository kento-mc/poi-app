'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const poiSchema = new Schema({
    name: String,
    description: String,
    location: {
        lat: Number,
        lon: Number
    },
    categories: [String],
    imageURL: String,
    contributor: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { collection: 'pointsofinterest' }); // give custom name to collection in the DB

poiSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    this.model('User').remove([{ contributedPOIs: this._id }], next);
});

module.exports = Mongoose.model('PointOfInterest', poiSchema);