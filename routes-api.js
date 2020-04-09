const PointsOfInterest = require('./app/api/pointsOfInterest');

module.exports = [
    { method: 'GET', path: '/api/pois', config: PointsOfInterest.find },
    { method: 'GET', path: '/api/pois/{_id}', config: PointsOfInterest.findOne }

];