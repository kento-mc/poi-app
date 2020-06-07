'use strict';

const assert = require('chai').assert;
const POIService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Category API tests', function() {
    let categories = fixtures.categories;
    let users = fixtures.users;
    let newUser = fixtures.newUser;
    let newAdminUser = fixtures.newAdminUser;
    let newCategory = fixtures.newCategory;

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

    setup(async function() {
        await poiService.deleteAllCategories();
    });

    teardown(async function() {
        await poiService.deleteAllCategories();
    });

    test('create a category', async function() {
        const returnedUser = await poiService.createUser(newUser);
        newCategory.contributor = returnedUser._id;
        const newCat = await poiService.createCategory(returnedUser._id, newCategory);
        const returnedCategories = await poiService.getCategories();
        assert.equal(returnedCategories.length, 1);
        assert(_.some([returnedCategories[0]], newCategory), 'returned category must be a superset of category');
    });

    test('create a category and check contributor', async function() {
        const returnedUser = await poiService.createUser(newUser);
        await poiService.createCategory(returnedUser._id, newCategory);
        const returnedCategories = await poiService.getCategories();
        assert.isDefined(returnedCategories[0].contributor);

        const user = await poiService.getUser(returnedCategories[0].contributor);
        assert.equal(user._id, returnedUser._id);
    });

    test('create multiple categories', async function() {
        const returnedUser = await poiService.createUser(newUser);
        for (let cat of categories){
            cat.contributor = returnedUser._id;
        }
        for (let i = 0; i < categories.length; i++) {
            let newCat = await poiService.createCategory(returnedUser._id, categories[i]);
        }

        const returnedCategories = await poiService.getCategoryByUser(returnedUser._id);
        assert.equal(returnedCategories.length, categories.length);
        for (let i = 0; i < categories.length; i++) {
            assert(_.some([returnedCategories[i]], categories[i]), 'returned category must be a superset of category');
        }
    });

    test('get categories', async function() {
        const returnedUser = await poiService.createUser(newUser);
        for (let i = 0; i < categories.length; i++) {
            await poiService.createCategory(returnedUser._id, categories[i]);
        }
        const c = await poiService.getCategories();
        assert.equal(c.length, categories.length);
    });

    test('get default categories', async function() {
        const returnedUser = await poiService.createUser(newUser);
        for (let i = 0; i < categories.length; i++) {
            categories[i].contributor = returnedUser._id;
            await poiService.createCategory(returnedUser._id, categories[i]);
        }
        const adminUser = await poiService.createUser(newAdminUser);
        for (let i = 0; i < 2; i++) {
            categories[i].contributor = adminUser._id;
            await poiService.createCategory(adminUser._id, categories[i]);
        }
        const allCs = await poiService.getCategories();
        assert.equal(allCs.length, 5);
        const defaultCs = await poiService.getDefaultCategories(adminUser._id)
        assert.equal(defaultCs.length, 2);

    });

    test('get categories by user', async function() {
        const user1 = await poiService.createUser(newUser);
        const user2 = await poiService.createUser(newUser);
        for (let i = 0; i < categories.length; i++) {
            await poiService.createCategory(user1._id, categories[i]);
            await poiService.createCategory(user2._id, categories[i]);
        }
        const allCs = await poiService.getCategories();
        assert.equal(allCs.length, 6);
        const user2Cs = await poiService.getCategoryByUser(user2._id)
        assert.equal(user2Cs.length, 3);
    });

    test('get category', async function() {
        const returnedUser = await poiService.createUser(newUser);
        for (let i = 0; i < categories.length; i++) {
            await poiService.createCategory(returnedUser._id, categories[i]);
        }
        const allCs = await poiService.getCategories();
        const gotC = await poiService.getCategory(allCs[0]._id);
        assert.equal(gotC._id, allCs[0]._id);
    });

    test('delete one category', async function() {
        const returnedUser = await poiService.createUser(newUser);
        for (let i = 0; i < categories.length; i++) {
            await poiService.createCategory(returnedUser._id, categories[i]);
        }
        const allCs = await poiService.getCategories();
        assert.equal(allCs.length, 3);
        const idToDelete = allCs[1]._id;
        await poiService.deleteOneCategory(idToDelete);
        const oneLess = await poiService.getCategories()
        assert.equal(oneLess.length, 2);
        for (let i = 0; i < oneLess.length; i++) {
            assert.notEqual(oneLess[i]._id, idToDelete);
        }
    });

    test('delete all categories', async function() {
        const returnedUser = await poiService.createUser(newUser);
        for (let i = 0; i < categories.length; i++) {
            await poiService.createCategory(returnedUser._id, categories[i]);
        }

        const c1 = await poiService.getCategories(returnedUser._id);
        assert.equal(c1.length, categories.length);
        await poiService.deleteAllCategories();
        const c2 = await poiService.getCategories(returnedUser._id);
        assert.equal(c2.length, 0);
    });
});