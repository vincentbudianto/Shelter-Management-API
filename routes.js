'use strict';

module.exports = function (app) {
    var cntlr = require('./controller');
    var multer = require('multer');
    var upload = multer({ dest: 'uploads/' });
    var accountValidation = require('./src/accountValidation');
    var placementRecommendation = require('./src/placementRecommendation');
    var victim = require('./src/victim');

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
        .get(victim.victimConditionHistory);

    app.route('/victim/history/need')
        .get(victim.victimNeedHistory);

    app.route('/victim/history/shelter')
        .post(cntlr.updateVictimShelter);

    app.route('/victim/history/condition')
        .post(cntlr.updateVictimCondition);

    app.route('/victim/history/need')
        .post(cntlr.updateVictimNeeds);

    // Shelter API
    app.route('/shelter')
        .get(cntlr.shelterList);
		
    app.route('/shelter')
        .post(cntlr.addShelter);
		
	// Login & Register API
    app.route('/register')
        .post(upload.single('photo'), cntlr.register);
        
	app.route('/login')
		.post(cntlr.login);

    // Disaster API
    app.route('/disaster')
        .get(cntlr.disasterList);

    app.route('/disaster')
        .post(cntlr.addDisaster);

    // Dashboard API
    app.route('/dashboard')
        .get(cntlr.dashboardData);

    app.route('/disaster/history/condition')
        .post(cntlr.updateDisasterConditions);

    // Validation API
    app.route('/check/staff')
        .get(accountValidation.isStaff);
    app.route('/check/shelter/staff')
        .get(accountValidation.isStaffShelter);
    app.route('/check/admin')
        .get(accountValidation.isAdmin);

    // Placement Recommendation
    app.route('/recommendation')
        .get(placementRecommendation.getAllRecommendation);
};