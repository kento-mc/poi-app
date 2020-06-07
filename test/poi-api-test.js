'use strict';

const assert = require('chai').assert;
const _ = require('lodash');
const POIService = require('./poi-service');
const fixtures = require('./fixtures.json');

suite('POI API tests', () => {

    let pois = fixtures.pois;
    let newPOI = fixtures.newPOI;
    let users = fixtures.users;
    let newUser = fixtures.newUser;
    let categories = fixtures.categories;
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

    setup(async () =>{
        await poiService.deleteAllPOIs();
    });

    teardown(async () => {
        await poiService.deleteAllPOIs();
    });

    test('create a poi', async () => {
        const returnedUser = await poiService.createUser(newUser);
        newPOI.contributor = returnedUser._id;
        const returnedPOI = await poiService.createPOI(newPOI);
        assert(_.some([returnedPOI], newPOI),  'returnedPOI must be a superset of newPOI');
        assert.isDefined(returnedPOI._id);
    });

    test('get poi', async function () {
        const poi1 = await poiService.createPOI(newPOI);
        const poi2 = await poiService.getPOI(poi1._id);
        assert.deepEqual(poi1, poi2);
    });

    test('get invalid poi', async function () {
        const poi1 = await poiService.getPOI('1234');
        assert.isNull(poi1);
        const poi2 = await poiService.getPOI('012345678901234567890123');
        assert.isNull(poi2);
    });

    test('delete a poi', async () => {
        let poi = await poiService.createPOI(newPOI);
        assert(poi._id != null);
        await poiService.deleteOnePOI(poi._id);
        poi = await poiService.getPOI(poi._id);
        assert(poi == null);
    });

    test('get all pois', async function () {
        const returnedUser = await poiService.createUser(newUser);
        for (let poi of pois) {
            poi.contributor = returnedUser._id;
            await poiService.createPOI(poi);
        }

        const allPOIs = await poiService.getPOIs();
        assert.equal(allPOIs.length, pois.length);
    });

    test('get pois detail', async function () {
        for (let poi of pois) {
            await poiService.createPOI(poi);
        }

        const allPOIs = await poiService.getPOIs();
        for (let i = 0; i < pois.length; i++) {
            assert(_.some([allPOIs[i]], pois[i]), 'returnedPOI must be a superset of newPOI');
        }
    });

    test('get all pois empty', async function () {
        const allPOIs = await poiService.getPOIs();
        assert.equal(allPOIs.length, 0);
    });
});