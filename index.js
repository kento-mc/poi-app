'use strict';

const Hapi = require('@hapi/hapi');
require('dotenv').config();
require('./app/models/db');
const ImageStore = require('./app/utils/image-store');

const cloudinaryCredentials = {
    cloud_name: process.env.cloud_name,
    api_key: process.env.cloud_api_key,
    api_secret: process.env.cloud_api_secret
};

const server = Hapi.server({
    port: process.env.PORT || 3000,
    routes: { cors: true }
});

async function init() {
    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/cookie'));
    /*await server.register({
        plugin: require('disinfect'),
        options: {
            disinfectQuery: true,
            disinfectParams: true,
            disinfectPayload: true
        }
    });*/

    server.validator(require('@hapi/joi'))

    ImageStore.configure(cloudinaryCredentials);

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layouts',
        partialsPath: './app/views/partials',
        helpersPath: './app/views/helpers', // Define path for custom handlebars helper
        layout: true,
        isCached: false,
    });

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: process.env.cookie_name,
            password: process.env.cookie_password,
            isSecure: false
        },
        redirectTo: '/',
    });

    server.auth.default('session');

    server.route(require('./routes'));
    server.route(require('./routes-api'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();