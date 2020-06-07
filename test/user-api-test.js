'use strict';

const assert = require('chai').assert;
const _ = require('lodash');
const POIService = require('./poi-service');
const fixtures = require('./fixtures.json');

suite('User API tests', function () {

    let users = fixtures.users;
    let newUser = fixtures.newUser;

    const poiService = new POIService(fixtures.poiService);

    suiteSetup(async function() {
        await poiService.deleteAllUsers();
        const returnedUser = await poiService.createUser(newUser);
        const response = await poiService.authenticate(newUser);
    });

    suiteTeardown(async function() {
        await poiService.deleteAllUsers();
        poiService.clearAuth();
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
        await poiService.deleteAllUsers();
        await poiService.createUser(newUser);
        await poiService.authenticate(newUser);
        for (let u of users) {
            await poiService.createUser(u);
        }

        const allUsers = await poiService.getUsers();
        assert.equal(allUsers.length, users.length + 1);
    });

    test('get users detail', async function() {
        await poiService.deleteAllUsers();
        const user = await poiService.createUser(newUser);
        await poiService.authenticate(newUser);
        for (let u of users) {
            await poiService.createUser(u);
        }

        const testUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            customCategories: user.customCategories,
            contributedPOIs: user.contributedPOIs
        };
        users.unshift(testUser);
        const allUsers = await poiService.getUsers();
        for (let i = 0; i < users.length; i++) {
            assert.equal(allUsers[i].firstName, users[i].firstName);
            assert.equal(allUsers[i].lastName, users[i].lastName);
            assert.equal(allUsers[i].fullName, users[i].fullName);
            assert.equal(allUsers[i].email, users[i].email);
            assert.equal(allUsers[i].password, users[i].password);
            assert.equal(allUsers[i].isAdmin, users[i].isAdmin);
        }
    });

    test('get all users empty', async function() {
        await poiService.deleteAllUsers();
        const user = await poiService.createUser(newUser);
        await poiService.authenticate(newUser);
        const allUsers = await poiService.getUsers();
        assert.equal(allUsers.length, 1);
    });

});