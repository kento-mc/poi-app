'use strict';

const assert = require('chai').assert;
const axios = require('axios');

suite('POI API tests', () => {

    test('get pois', async () => {
        const response = await axios.get('http://localhost:3000/api/pois');
        const pois = response.data;
        assert.equal(20, pois.length);

        assert.equal(pois[0].name, 'Springfield Gorge');
        assert.equal(pois[0].description, 'Jump it!');

        assert.equal(pois[1].name, 'The Murderhorn');
        assert.equal(pois[1].description, 'The murderiest mountain in Springfield');
    });

    test('get one poi', async () => {
        let response = await axios.get('http://localhost:3000/api/pois');
        const pois = response.data;
        assert.equal(20, pois.length);

        const onePOIUrl = 'http://localhost:3000/api/pois/' + pois[0]._id;
        response = await axios.get(onePOIUrl);
        const onePOI = response.data;

        assert.equal(onePOI.name, 'Springfield Gorge');
        assert.equal(onePOI.description, 'Jump it!');
    });

    test('create a poi', async () => {
        const poisUrl = 'http://localhost:3000/api/pois';
        const newPOI = {
            name: 'Duff Stadium',
            description: 'Home of the Isotopes',
            location: {
                lat: 50,
                lon: -50
            },
            categories: [],
            imageURL: ['https://vignette.wikia.nocookie.net/simpsons/images/4/48/Duff_Stadium.png/revision/latest?cb=20100331225926'],
            thumbnailURL: 'https://vignette.wikia.nocookie.net/simpsons/images/4/48/Duff_Stadium.png/revision/latest?cb=20100331225926',
            contributor: null
        };

        const response = await axios.post(poisUrl, newPOI);
        const returnedPOI = response.data;
        assert.equal(201, response.status);

        assert.equal(returnedPOI.name, 'Duff Stadium');
        assert.equal(returnedPOI.description, 'Home of the Isotopes');
    });

    test('delete a poi', async function() {
        let response = await axios.get('http://localhost:3000/api/pois');
        let pois = response.data;
        const originalSize = pois.length;

        const onePOIUrl = 'http://localhost:3000/api/pois/' + pois[0]._id;
        response = await axios.get(onePOIUrl);
        const onePOI = response.data;
        assert.equal(onePOI.name, 'Springfield Gorge');

        response = await axios.delete('http://localhost:3000/api/pois/' + pois[0]._id);
        assert.equal(response.data.success, true);

        response = await axios.get('http://localhost:3000/api/pois');
        pois = response.data;
        assert.equal(pois.length, originalSize - 1);
    });

    test('delete all pois', async function() {
        let response = await axios.get('http://localhost:3000/api/pois');
        let pois = response.data;
        const originalSize = pois.length;
        assert(originalSize > 0);
        response = await axios.delete('http://localhost:3000/api/pois');
        response = await axios.get('http://localhost:3000/api/pois');
        pois = response.data;
        assert.equal(pois.length, 0);
    });
});