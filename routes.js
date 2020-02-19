const PointsOfInterest = require('./app/controllers/pointsOfInterest');
const Accounts = require('./app/controllers/accounts');

module.exports = [
    { method: 'GET', path: '/', config: Accounts.index },
    { method: 'GET', path: '/signup', config: Accounts.showSignup },
    { method: 'GET', path: '/login', config: Accounts.showLogin },
    { method: 'GET', path: '/logout', config: Accounts.logout },
    { method: 'POST', path: '/signup', config: Accounts.signup },
    { method: 'POST', path: '/login', config: Accounts.login },
    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },

    { method: 'GET', path: '/home', config: PointsOfInterest.home },
    { method: 'GET', path: '/report', config: PointsOfInterest.report },
    { method: 'POST', path: '/addpoi', config: PointsOfInterest.addPOI },
    { method: 'POST', path: '/uploadimage', config: PointsOfInterest.uploadImage },

    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public'
            }
        },
        options: { auth: false }
    }
];