'use strict';

var response = require('../res');
var dbManager = require('../controller');

const isStaff = (req, res) => {
    const { id } = req.query;

    if (id) {
        dbManager.isStaff(id, (err, data) => {
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

const isStaffShelter = (req, res) => {
    const { staffId, shelterId } = req.query;

    if (staffId && shelterId) {
        dbManager.isStaffShelter(staffId, shelterId, (err, data) => {
            if (err) {
                console.log(err)
                response.fail(err, res)
            } else {
                response.ok(data, res)
            }
        });
    } else {
        response.fail('staffId and/or shelterId not supplied', res)
    }
}

const isAdmin = (req, res) => {
    const { id } = req.query;

    if (id) {
        dbManager.isAdmin(id, (err, data) => {
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

module.exports = {
  isStaff: isStaff,
  isStaffShelter: isStaffShelter,
  isAdmin: isAdmin
}