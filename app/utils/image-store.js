'use strict';

const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const ImageStore = {
    configure: function(credentials) {
        cloudinary.config(credentials);
    },

    getAllImages: async function() {
        const result = await cloudinary.api.resources();
        return result.resources;
    },

    uploadImage: async function(path) {
        const cloudImage = await cloudinary.uploader.upload(path)
            // Deletes image from server
            fs.readdir('./public/uploads/', (err, files) => {
                if (err) throw err;

                for (const file of files) {
                    fs.unlink(path, err => {
                        if (err) throw err;
                    });
                }
            });
        return cloudImage;
    },   // TODO Handle uploads with no image

    deleteImage: async function(id) {
        await cloudinary.v2.uploader.destroy(id, {});
    },

};


module.exports = ImageStore;
