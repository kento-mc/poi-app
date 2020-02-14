const Controller = require('./controller.js');

module.exports = [{ method: 'GET', path: '/', config: Controller.index }];