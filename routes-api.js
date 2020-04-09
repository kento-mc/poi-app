const PointsOfInterest = require('./app/api/pointsOfInterest');

module.exports = [
    { method: 'GET', path: '/api/pois', config: PointsOfInterest.find },
    { method: 'GET', path: '/api/pois/{id}', config: PointsOfInterest.findOne },
    { method: 'POST', path: '/api/pois', config: PointsOfInterest.create },
    { method: 'DELETE', path: '/api/pois/{id}', config: PointsOfInterest.deleteOne },
    { method: 'DELETE', path: '/api/pois', config: PointsOfInterest.deleteAll }
];