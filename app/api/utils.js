const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createToken = function (user) {
    return jwt.sign({ id: user._id, email: user.email }, 'secretpasswordnotrevealedtoanyone', {
        algorithm: 'HS256',
        expiresIn: '1h',
    });
};

exports.decodeToken = function (token) {
    const userInfo = {};
    try {
        const decoded = jwt.verify(token, 'secretpasswordnotrevealedtoanyone');
        userInfo.userId = decoded.id;
        userInfo.email = decoded.email;
    } catch (e) {
    }

    return userInfo;
};

exports.validate = async function(decoded, request) {
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
        return { isValid: false };
    } else {
        return { isValid: true };
    }
};

exports.getUserIdFromRequest = function(request) {
    let userId = null;
    try {
        const authorization = request.headers.authorization;
        const token = authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'secretpasswordnotrevealedtoanyone');
        userId = decodedToken.id;
    } catch (e) {
        userId = null;
    }
    return userId;
};