'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');

const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'Welcome to the POI App' });
        }
    },
    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up!' });
        }
    },
    signup: {
        auth: false,
        validate: { //TODO fix clearing of form when error thrown
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const payload = request.payload;
                let user = await User.findByEmail(payload.email);
                if (user) {
                    const message = 'Email address is already registered';
                    throw Boom.badData(message);
                }

                //TODO hashing and salting

                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    fullName: `${payload.firstName} ${payload.lastName}`,
                    email: payload.email,
                    password: payload.password,
                    isAdmin: false
                });
                user = await newUser.save();
                request.cookieAuth.set({ id: user.id });
                return h.redirect('/home');
            } catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        },
        plugins: {
            disinfect: {
                disinfectQuery: true,
                disinfectParams: false,
                disinfectPayload: true
            }
        }
    },
    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login!' });
        }
    },
    login: {
        auth: false,
        validate: { //TODO fix clearing of form when error thrown
            payload: {
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('login', {
                        title: 'Sign in error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'Email address is not registered';
                    throw Boom.unauthorized(message);
                }
                user.comparePassword(password);
                request.cookieAuth.set({ id: user.id });
                if (user.isAdmin) {
                    return h.redirect('/homeadmin')
                } else {
                    return h.redirect('/home');
                }
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        },
        plugins: {
            disinfect: {
                disinfectQuery: true,
                disinfectParams: false,
                disinfectPayload: true
            }
        }
    },
    logout: {
        auth: false,
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    },
    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                return h.view('settings', { title: 'User Settings', user: user });
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    updateSettings: {
        validate: { //TODO fix clearing of form when error is thrown
            payload: {
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('settings', {
                        title: 'User settings update error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const userEdit = request.payload;
            const id = request.auth.credentials.id;
            const user = await User.findById(id);
            user.firstName = userEdit.firstName;
            user.lastName = userEdit.lastName;
            user.fullName = `${userEdit.firstName} ${userEdit.lastName}`
            user.email = userEdit.email;
            user.password = userEdit.password;
            await user.save();
            return h.redirect('/settings');
        },
        plugins: {
            disinfect: {
                disinfectQuery: true,
                disinfectParams: false,
                disinfectPayload: true
            }
        }
    },
    deleteUser: {
        handler: async function(request, h) {
            await User.deleteOne({'_id': request.params}, err => console.log(err));
            console.log('User deleted');
            return h.redirect('/homeadmin');
        }
    }
};

module.exports = Accounts;