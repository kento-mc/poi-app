'use strict'

require('dotenv').config();
const fs = require('fs');
const PointOfInterest = require('../models/pointOfInterest');
const User = require('../models/user');
//const ImageUpload = require('../../imageConfig');
const cloudinary = require('cloudinary').v2;
//const cloudinaryStorage = require('multer-storage-cloudinary');
//const multer = require('multer');

/*const imageStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"]
})*/

//const imageParser =  multer({storage: imageStorage});
//const upload = multer({dest: 'uploads/'});

const PointsOfInterest = {
    home: {
        handler: function(request, h) {
            return h.view('home', {
                title: 'Add a Point of Interest',
                cloudName: process.env.cloud_name
            });
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

            const newPOI = new PointOfInterest({
              name: data.name,
              description: data.description,
              contributer: user._id,
              imageURL: cloudImage.url
            })
            await newPOI.save();
            return h.redirect('/report');
        },
        payload: {
            output: 'stream',
            parse: true,
            multipart: true
        }
    }
};

module.exports = PointsOfInterest;