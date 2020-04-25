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

const changeVictimNeedStatus = (req, res) => {
    const { id, status } = req.body
  
    if (id && status != undefined) {
        dbManager.changeVictimNeedStatus(id, status, (err, data) => {
            if (err) {
                console.log(err)
                response.fail(err, res)
            } else {
                response.ok(data, res)
            }
        });
    } else {
        response.fail('id or status not supplied', res)
    }
  }
  
  const changeVictimConditionStatus = (req, res) => {
    const { id, status } = req.body;
  
    if (id && status != undefined) {
        dbManager.changeVictimConditionStatus(id, status, (err, data) => {
            if (err) {
                console.log(err)
                response.fail(err, res)
            } else {
                response.ok(data, res)
            }
        });
    } else {
        response.fail('id or status not supplied', res)
    }
  }

module.exports = {
  victimNeedHistory: victimNeedHistory,
  victimConditionHistory: victimConditionHistory,
  changeVictimNeedStatus: changeVictimNeedStatus,
  changeVictimConditionStatus: changeVictimConditionStatus,
}