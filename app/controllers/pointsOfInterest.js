'use strict'

const PointOfInterest = require('../models/pointOfInterest');
const User = require('../models/user');

const PointsOfInterest = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Add a Point of Interest' });
        }
    },
    report: {
        handler: async function(request, h) {
            const pointsOfInterest = await PointOfInterest.find().populate('contributer').lean();
            return h.view('report', {
                title: 'Points of Interest added to Date',
                pointsOfInterest: pointsOfInterest
            });
        }
    },
    addPOI: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id);
            const data = request.payload;
            const newPOI = new PointOfInterest({
                name: data.name,
                description: data.description,
                contributer: user._id
            })
            await newPOI.save();
            return h.redirect('/report');
        }
    }
};

module.exports = PointsOfInterest;