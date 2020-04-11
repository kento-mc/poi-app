'use strict';

const Category = require('../models/category');
const User = require('../models/user');
const Boom = require('@hapi/boom');

const Categories = {
    findAll: {
        auth: false,
        handler: async function (request, h) {
            const categories = await Category.find();
            return categories;
        }
    },

    findOne: {
        auth: false,
        handler: async function (request, h) {
            const category = await Category.findOne().where({_id: request.params.id});
            return category;
        }
    },

    findDefaults: {
        auth: false,
        handler: async function(request, h) {
            const categories = await Category.find({ contributor: request.params.id });
            return categories;
        }
    },

    findByUser: {
        auth: false,
        handler: async function(request, h) {
            const categories = await Category.find({ contributor: request.params.id });
            return categories;
        }
    },

    create: {
        auth: false,
        handler: async function(request, h) {
            let category = new Category(request.payload);
            const user = await User.findOne({ _id: request.params.id });
            if (!user) {
                return Boom.notFound('No user with this id');
            }
            category.contributor = user._id;
            category = await category.save();
            return category;
        }
    },

    deleteOne: {
        auth: false,
        handler: async function(request, h) {
            const response = await Category.deleteOne({ _id: request.params.id });
            if (response.deletedCount === 1) {
                return { success: true };
            }
            return Boom.notFound('id not found');
        }
    },

    deleteAll: {
        auth: false,
        handler: async function (request, h) {
            await Category.deleteMany({});
            return {success: true};
        }
    }

};

module.exports = Categories;