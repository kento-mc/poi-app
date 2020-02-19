'use strict'

require('dotenv').config();
const fs = require('fs');
const PointOfInterest = require('../models/pointOfInterest');
const User = require('../models/user');
//const ImageUpload = require('../../imageConfig');
const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

const imageStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "demo",
    allowedFormats: ["jpg", "png"]
})

const imageParser =  multer({storage: imageStorage});
const upload = multer({dest: 'uploads/'});

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
/*        pre: [
            { method: upload.single('poiImage'), assign: 'm1' }
            //{ method: imageParser.single('poiImage'), assign: 'm1'}
        ],*/
/*        payload: {
            output: 'stream',
            parse: true,
            //allow: 'multipart/form-data',
        },*/
        handler: async function (request, h) {
              const id = request.auth.credentials.id;
              const user = await User.findById(id);
              const data = request.payload;
              if (data.image) {
                  cloudinary.uploader.upload(data.image.path, (error, result) =>
                  {console.log(result, error)});
              }
              const newPOI = new PointOfInterest({
                  name: data.name,
                  description: data.description,
                  contributer: user._id
              })
              await newPOI.save();
              console.log();
              return h.redirect('/report');
        },
        payload: {
            output: 'file',
            parse: true,
            multipart: true
        }

    },
    uploadImage: {
        handler: async function (request, h) {
            // open the upload widget
            //const preset = cloudinary.api.upload_preset('poi_preset');
            //const widget = cloudinary.createUploadWidget({
            //    cloudName: process.env.cloud_name, uploadPreset: "poi_preset" }, (error, result) => {
            //    console.log(result);
            //});
            //widget.open();
            //return h.redirect('/home');
        }
    }
};

module.exports = PointsOfInterest;