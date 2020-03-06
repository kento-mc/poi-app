'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    customCategories: [String],
    contributedPOIs: [{
        type: Schema.Types.ObjectId,
        ref: 'pointsofinterest'
    }]
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
};

userSchema.statics.findByFullName = function(fullName) {
    return this.findOne({ fullName : fullName });
};

userSchema.methods.comparePassword = function(candidatePassword) {
    const isMatch = this.password === candidatePassword;
    if (!isMatch) {
        throw Boom.unauthorized('Password mismatch');
    }
    return this;
};

module.exports = Mongoose.model('User', userSchema);