const PointsOfInterest = require('./app/api/pointsOfInterest');
const Users = require('./app/api/users');

module.exports = [
    { method: 'GET', path: '/api/pois', config: PointsOfInterest.find },
    { method: 'GET', path: '/api/pois/{id}', config: PointsOfInterest.findOne },
    { method: 'POST', path: '/api/pois', config: PointsOfInterest.create },
    { method: 'DELETE', path: '/api/pois/{id}', config: PointsOfInterest.deleteOne },
    { method: 'DELETE', path: '/api/pois', config: PointsOfInterest.deleteAll },

    { method: 'GET', path: '/api/users', config: Users.find },
    { method: 'GET', path: '/api/users/{id}', config: Users.findOne },
    { method: 'POST', path: '/api/users', config: Users.create },
    { method: 'DELETE', path: '/api/users/{id}', config: Users.deleteOne },
    { method: 'DELETE', path: '/api/users', config: Users.deleteAll }
];