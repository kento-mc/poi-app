'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
};

userSchema.methods.comparePassword = function(candidatePassword) {
    const isMatch = this.password === candidatePassword;
    return isMatch;
};

module.exports = Mongoose.model('User', userSchema);