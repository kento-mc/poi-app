const PointsOfInterest = require('./app/api/pointsOfInterest');
const Users = require('./app/api/users');
const Categories = require('./app/api/categories');

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
    { method: 'DELETE', path: '/api/users', config: Users.deleteAll },

    { method: 'GET', path: '/api/categories', config: Categories.findAll },
    { method: 'GET', path: '/api/categories/defaults/{id}', config: Categories.findDefaults },
    { method: 'GET', path: '/api/users/{id}/categories', config: Categories.findByUser },
    { method: 'POST', path: '/api/users/{id}/categories', config: Categories.create },
    { method: 'DELETE', path: '/api/categories/{id}', config: Categories.deleteOne },
    { method: 'DELETE', path: '/api/categories', config: Categories.deleteAll }

];