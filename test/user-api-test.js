'use strict';

const assert = require('chai').assert;
const _ = require('lodash');
const POIService = require('./poi-service');
const fixtures = require('./fixtures.json');

suite('User API tests', function () {

    let users = fixtures.users;
    let newUser = fixtures.newUser;

    const poiService = new POIService(fixtures.poiService);

    setup(async function () {
        await poiService.deleteAllUsers();
    });

    teardown(async function () {
        await poiService.deleteAllUsers();
    });

    test('create a user', async function () {
        const returnedUser = await poiService.createUser(newUser);
        assert(_.some([returnedUser], newUser), 'returnedUser must be a superset of newUser');
        assert.isDefined(returnedUser._id);
    });

    test('get user', async function () {
        const u1 = await poiService.createUser(newUser);
        const u2 = await poiService.getUser(u1._id);
        assert.deepEqual(u1, u2);
    });

    test('get invalid user', async function () {
        const u1 = await poiService.getUser('1234');
        assert.isNull(u1);
        const u2 = await poiService.getUser('012345678901234567890123');
        assert.isNull(u2);
    });


    test('delete a user', async function () {
        let u = await poiService.createUser(newUser);
        assert(u._id != null);
        await poiService.deleteOneUser(u._id);
        u = await poiService.getUser(u._id);
        assert(u == null);
    });

    test('get all users', async function () {
        for (let u of users) {
            await poiService.createUser(u);
        }

        const allUsers = await poiService.getUsers();
        assert.equal(allUsers.length, users.length);
    });

    test('get users detail', async function () {
        for (let u of users) {
            await poiService.createUser(u);
        }

        const allUsers = await poiService.getUsers();
        for (var i = 0; i < users.length; i++) {
            assert(_.some([allUsers[i]], users[i]), 'returnedUser must be a superset of newUser');
        }
    });

    test('get all users empty', async function () {
        const allUsers = await poiService.getUsers();
        assert.equal(allUsers.length, 0);
    });

});