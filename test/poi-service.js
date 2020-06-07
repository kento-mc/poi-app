'use strict';

const axios = require('axios');
const baseUrl = '';

class POIService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async authenticate(user) {
        try {
            const response = await axios.post(this.baseUrl + '/api/users/authenticate', user);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async clearAuth(user) {
        axios.defaults.headers.common['Authorization'] = '';
    }

    async getPOIs() {
        const response = await axios.get(this.baseUrl + '/api/pois');
        return response.data;
    }

    async getPOI(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/pois/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createPOI(newPOI) {
        const response = await axios.post(this.baseUrl + '/api/pois', newPOI);
        return response.data;
    }

    async deleteAllPOIs() {
        const response = await axios.delete(this.baseUrl + '/api/pois');
        return response.data;
    }

    async deleteOnePOI(id) {
        const response = await axios.delete(this.baseUrl + '/api/pois/' + id);
        return response.data;
    }

    async getUsers() {
        const response = await axios.get(this.baseUrl + '/api/users');
        return response.data;
    }

    async getUser(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/users/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createUser(newUser) {
        const response = await axios.post(this.baseUrl + '/api/users', newUser);
        return response.data;
    }

    async deleteAllUsers() {
        try {
            const response = await axios.delete(this.baseUrl + '/api/users');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteOneUser(id) {
        try {
            const response = await axios.delete(this.baseUrl + '/api/users/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async createCategory(id, category) {
        try {
            const response = await axios.post(this.baseUrl + '/api/users/' + id + '/categories', category);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getCategories() {
        try {
            const response = await axios.get(this.baseUrl + '/api/categories');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getCategory(catId) {
        try {
            const response = await axios.get( this.baseUrl + '/api/categories/' + catId)
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getDefaultCategories(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/categories/defaults/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async getCategoryByUser(id) {
        try {
            const response = await axios.get(this.baseUrl + '/api/users/' + id + '/categories');
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteOneCategory(id) {
        try {
            const response = await axios.delete(this.baseUrl + '/api/categories/' + id);
            return response.data;
        } catch (e) {
            return null;
        }
    }

    async deleteAllCategories() {
        try {
            const response = await axios.delete(this.baseUrl + '/api/categories');
            return response.data;
        } catch (e) {
            return null;
        }
    }
}

module.exports = POIService;