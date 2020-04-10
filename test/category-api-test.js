'use strict';

const assert = require('chai').assert;
const POIService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Donation API tests', function() {
    let categories = fixtures.categories;
    let newUser = fixtures.newUser;

    const poiService = new POIService(fixtures.poiService);

    setup(async function() {
        poiService.deleteAllUsers();
        poiService.deleteAllCategories();
    });

    teardown(async function() {
        poiService.deleteAllUsers();
        poiService.deleteAllCategories();
    });

    test('create a category', async function() {
        const returnedUser = await poiService.createUser(newUser);
        categories[0].contributor = returnedUser._id;
        await poiService.createCategory(returnedUser._id, categories[0]);
        const returnedCategories = await poiService.getCategories(returnedUser._id);
        assert.equal(returnedCategories.length, 1);
        assert(_.some([returnedCategories[0]], categories[0]), 'returned category must be a superset of category');
    });

    //TODO
    test('create multiple categories', async function() {
        const returnedCandidate = await donationService.createCandidate(newCandidate);
        for (var i = 0; i < donations.length; i++) {
            await donationService.makeDonation(returnedCandidate._id, donations[i]);
        }

        const returnedDonations = await donationService.getDonations(returnedCandidate._id);
        assert.equal(returnedDonations.length, donations.length);
        for (var i = 0; i < donations.length; i++) {
            assert(_.some([returnedDonations[i]], donations[i]), 'returned donation must be a superset of donation');
        }
    });

    test('get categories', async function() {

    });

    test('get default categories', async function() {

    });

    test('get categories by user', async function() {

    });

    test('get category', async function() {

    });

    test('delete one category', async function() {

    });

    //TODO
    test('delete all categories', async function() {
        const returnedCandidate = await donationService.createCandidate(newCandidate);
        for (var i = 0; i < donations.length; i++) {
            await donationService.makeDonation(returnedCandidate._id, donations[i]);
        }

        const d1 = await donationService.getDonations(returnedCandidate._id);
        assert.equal(d1.length, donations.length);
        await donationService.deleteAllDonations();
        const d2 = await donationService.getDonations(returnedCandidate._id);
        assert.equal(d2.length, 0);
    });
});