'use strict';

const Boom = require('@hapi/boom');
const PointOfInterest = require('../models/pointOfInterest');

const PointsOfInterest = {
    find: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            const pois = await PointOfInterest.find();
            return pois;
        }
    },

    findOne: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            try {
                const poi = await PointOfInterest.findOne({_id: request.params.id});
                if (!poi) {
                    return Boom.notFound('No point of interest with this id');
                }
                return poi;
            } catch (err) {
                return Boom.notFound('No point of interest with this id');
            }
        }
    },

    create: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            const newPOI = new PointOfInterest(request.payload);
            const poi = await newPOI.save();
            if (poi) {
                return h.response(poi).code(201);
            }
            return Boom.badImplementation('error creating poi');
        }
    },

    update: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            const poi = await PointOfInterest.findOne({_id: request.params.id});
            try {
                await PointOfInterest.updateOne(
                    {_id: request.params.id},
                    {
                        $set: {
                            name: request.payload.name,
                            description: request.payload.description,
                            location: {
                                lat: request.payload.lat,
                                lon: request.payload.lon
                            },
                            thumbnailURL: request.payload.thumbnailURL,
                            imageURL: request.payload.imageURL ? request.payload.imageURL : poi.imageURL
                        }
                    }
                );
                const poi = await PointOfInterest.findOne({_id: request.params.id});
                if (!poi) {
                    return Boom.notFound('No point of interest with this id');
                }
                return poi;
            } catch (err) {
                return Boom.notFound('No point of interest with this id');
            }
        }
    },

    deleteAll: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            await PointOfInterest.deleteMany({});
            return { success: true };
        }
    },

    deleteOne: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            const response = await PointOfInterest.deleteOne({ _id: request.params.id });
            if (response.deletedCount == 1) {
                return { success: true };
            }
            return Boom.notFound('id not found');
        }
    },

    uploadImage: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {

        }
    }
};

module.exports = PointsOfInterest;