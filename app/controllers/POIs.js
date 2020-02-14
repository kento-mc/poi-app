const POIs = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Add a POI' });
        }
    },
    report: {
        handler: function(request, h) {
            return h.view('report', {
                title: 'POIs added to Date',
                donations: this.POIs
            });
        }
    },
    addPOI: {
        handler: function (request, h) {
            let data = request.payload;
            var donorEmail = request.auth.credentials.id;
            data.contributer = this.users[donorEmail];
            this.POIs.push(data);
            return h.redirect('/report');
        }
    }
};

module.exports = POIs;