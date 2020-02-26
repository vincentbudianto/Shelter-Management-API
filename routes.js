'use strict';

module.exports = function (app) {
    var cntlr = require('./controller');

    app.route('/')
        .get(cntlr.index);

    // Victim API
    app.route('/victim/search/shelter')
        .get(cntlr.victimByShelter);

    app.route('/victim/search/name')
        .get(cntlr.victimByName);

    app.route('/victim/search/keyword')
        .get(cntlr.victimByKeyword);

    app.route('/victim/detail')
        .get(cntlr.victimDetail);

    app.route('/victim/history/shelter')
        .get(cntlr.victimShelterHistory);

    app.route('/victim/history/condition')
        .get(cntlr.victimConditionHistory);

    app.route('/victim/history/need')
        .get(cntlr.victimNeedHistory);

    // Shelter API
    app.route('/shelter')
        .get(cntlr.shelterList);
};