'use strict';

var response = require('../res');
var dbManager = require('../controller');

const victimNeedHistory = (req, res) => {
    const { id } = req.query;

    if (id) {
        dbManager.getVictimNeedHistory(id, (err, data) => {
            if (err) {
                console.log(err)
                response.fail(err, res)
            } else {
                response.ok(data, res)
            }
        });
    } else {
        response.fail('id not supplied', res)
    }
}

const victimConditionHistory = (req, res) => {
    const { id } = req.query;

    if (id) {
        dbManager.getVictimConditionHistory(id, (err, data) => {
            if (err) {
                console.log(err)
                response.fail(err, res)
            } else {
                response.ok(data, res)
            }
        });
    } else {
        response.fail('id not found', res)
    }
};

module.exports = {
  victimNeedHistory: victimNeedHistory,
  victimConditionHistory: victimConditionHistory
}