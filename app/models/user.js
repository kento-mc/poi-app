'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    fullName: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    customCategories: Number, //TODO update using category model...maybe
    contributedPOIs: Number  //TODO update using poi model...maybe
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
};

userSchema.statics.findByFullName = function(fullName) {
    return this.findOne({ fullName : fullName });
};

userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = Mongoose.model('User', userSchema);