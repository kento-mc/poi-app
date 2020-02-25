'use strict';

require('dotenv').config();
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const PointOfInterest = require('../models/pointOfInterest');
const User = require('../models/user');

const PointsOfInterest = {
    home: {
        handler: async function(request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id);
            const userPOIArray = []
            for (let id of user.contributedPOIs) {
                let poi = await PointOfInterest.findOne().where({'_id': id}).lean();
                userPOIArray.push(poi);
            }
            console.log(user.contributedPOIs);
            return h.view('home', {
                title: 'Add a Point of Interest',
                //cloudName: process.env.cloud_name,
                pointsOfInterest: userPOIArray
            });
        }
    },
    report: {
        handler: async function(request, h) {
            const pointsOfInterest = await PointOfInterest.find().populate('contributer').lean();
            return h.view('report', {
                title: 'Points of Interest added to date',
                pointsOfInterest: pointsOfInterest
            });
        }
    },
    addPOI: {
        handler: async function (request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id);
            const data = request.payload;
            let cloudImage = {};

            if (data.image) {
                const name = data.image.hapi.filename;
                const now = new Date().toISOString();
                const path = `./uploads/${name}${now}`;
                const file = fs.createWriteStream(path);

                file.on('error', (err) => console.error(err));

                data.image.pipe(file);

                data.image.on('end', (err) => {
                    const ret = {
                        filename: data.image.hapi.filename,
                        headers: data.image.hapi.headers
                    }
                    return JSON.stringify(ret);
                })

                cloudImage = await cloudinary.uploader.upload(path, (error, result) => {
                    if (error) {
                        console.log(error);
                    } else { // Deletes image from server
                        fs.readdir('./uploads/', (err, files) => {
                            if (err) throw err;

                            for (const file of files) {
                                fs.unlink(path, err => {
                                    if (err) throw err;
                                });
                            }
                        });
                    }
                });
            } // TODO Handle uploads with no image

            const newPOI = await new PointOfInterest({
              name: data.name,
              description: data.description,
              contributer: user._id,
              imageURL: cloudImage.url
            });
            await newPOI.save();
            const poi = await PointOfInterest
                .findOne()
                .where({'imageURL': cloudImage.url})
                .populate('contributer')
                .lean();
            console.log(user.contributedPOIs);
            await User.findOne({'_id': user.id}, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    user.contributedPOIs.push(poi._id);
                    user.save();
                }
            });
            /*await User.findOneAndUpdate({'_id': user.id}, {$push: {'contributedPOIs':  poi._id}}, {
                new: true,
                useFindAndModify: false
            }, (err, poi) => {
                console.log(err, poi);
            });*/
            //user.contributedPOIs.push(poi._id);
            return h.redirect('/report');
        },
        payload: {
            output: 'stream',
            parse: true,
            multipart: true
        }
    },
    showPOI: {
        handler: async function(request, h) {
            //const id = request.auth.credentials.id;
            //const user = await User.findById(id);
            const poi = await PointOfInterest
                .findOne()
                .where({'_id': request.params})
                .populate('contributer')
                .lean();
            return h.view('poi', {
                title: `${poi.name} Settings`,
                name: poi.name,
                description: poi.description,
                contributer: poi.contributer,
                image: poi.imageURL,
                _id: poi._id
            });
        }
    },
    showUpdatePOI: {
        handler: async function(request, h) {
            //const id = request.auth.credentials.id;
            //const user = await User.findById(id);
            const poi = await PointOfInterest
                .findOne()
                .where({'_id': request.params})
                .populate('contributer')
                .lean();
            return h.view('updatepoi', {
                title: `${poi.name} Settings`,
                name: poi.name,
                description: poi.description,
                contributer: poi.contributer,
                image: poi.imageURL,
                _id: poi._id
            });
        }
    },
    updatePOI: {
        handler: async function (request, h) {
            const poiEdit = request.payload;
            const newPOI = await PointOfInterest.findOneAndUpdate({'_id': request.params}, {$set: poiEdit},
                {
                    new: true,
                    useFindAndModify: false
                }, (err, poi) => {
                console.log(err, poi);
            });
            await newPOI.save();
            return h.redirect(`/poi/${newPOI._id}`)
        }
    },
    deletePOI: {
        handler: async function (request, h) {
            const pointsOfInterest = await PointOfInterest.find().populate('contributer').lean();
            await PointOfInterest.deleteOne({'_id': request.params}, err => console.log(err));
            console.log('POI deleted');
            return h.redirect('/report', {
                title: 'Points of Interest added to Date',
                pointsOfInterest: pointsOfInterest
            });
        }
    }
};

module.exports = PointsOfInterest;