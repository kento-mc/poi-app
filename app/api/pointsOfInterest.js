'use strict';

const Boom = require('@hapi/boom');
const PointOfInterest = require('../models/pointOfInterest');

const PointsOfInterest = {
    find: {
        auth: false,
        handler: async function(request, h) {
            const pois = await PointOfInterest.find();
            return pois;
        }
    },
    findOne: {
        auth: false,
        handler: async function(request, h) {
            try {
                const poi = await PointOfInterest.findOne({_id: request.params._id});
                if (!poi) {
                    return Boom.notFound('No point of interest with this id');
                }
                return poi;
            } catch (err) {
                return Boom.notFound('No point of interest with this id');
            }
        }
    }
};

module.exports = PointsOfInterest;