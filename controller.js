'use strict';

var response = require('./res');
var connection = require('./conn');
const INTERNAL_ERROR = 'Internal Server Error';

exports.victimByShelter = function (req, res) {
    const { id } = req.query;

    if (id) {
        connection.query(`SELECT VictimID, NIK, Name, ConditionStatus
            FROM victim LEFT JOIN conditionhistory USING (VictimID)
            WHERE CurrentShelterID = ?`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        });
    } else {
        response.fail('id not found', res)
    }
};

exports.victimByName = function (req, res) {
    const { name } = req.query;

    if (name) {
        const searchName = '%' + name + '%'
        connection.query(`SELECT VictimID, NIK, Name, ConditionStatus
            FROM victim LEFT JOIN conditionhistory USING (VictimID)
            WHERE Name LIKE ?`, [searchName], function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        });
    } else {
        response.fail('name not found', res)
    }
};

exports.victimByKeyword = function (req, res) {
    const { keyword } = req.query;

    if (keyword) {
        const searchKeyword = '%' + keyword + '%'
        connection.query(`SELECT VictimID, NIK, victim.Name, ConditionStatus, shelter.Name AS 'Shelter'
            FROM victim LEFT JOIN shelter ON victim.CurrentShelterID=shelter.ShelterID
                LEFT JOIN conditionhistory USING (VictimID)
            WHERE victim.Name LIKE ? OR shelter.Name LIKE ?`, [searchKeyword, searchKeyword], function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        });
    } else {
        response.fail('keyword not found', res)
    }
};

exports.victimDetail = function (req, res) {
    const { id } = req.query;

    if (id) {
        connection.query(`SELECT NIK, NoKK, Name, Age,
                CurrentShelterID AS 'ShelterID', ConditionStatus AS 'Condition',
                NeedsDesc AS 'Needs', Photo
            FROM victim LEFT JOIN ConditionHistory USING (VictimID)
                LEFT JOIN NeedsHistory USING (VictimID)
            WHERE VictimID = ?`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows[0], res)
            }
        });
    } else {
        response.fail('id not found', res)
    }
};

exports.victimShelterHistory = function (req, res) {
    const { id } = req.query;

    if (id) {
        connection.query(`SELECT ShelterID, Name, District, City, Province, Country, Latitude, Longitude, Timestamp
            FROM ShelterHistory LEFT JOIN Shelter USING (ShelterID)
            WHERE VictimID = ?`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        });
    } else {
        response.fail('id not found', res)
    }
};

exports.victimConditionHistory = function (req, res) {
    const { id } = req.query;

    if (id) {
        connection.query(`SELECT ConditionName as 'Name', ConditionDesc as 'Desc', ConditionStatus as 'Status', Timestamp
            FROM ConditionHistory
            WHERE VictimID = ?`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        });
    } else {
        response.fail('id not found', res)
    }
};

exports.victimNeedHistory = function (req, res) {
    const { id } = req.query;

    if (id) {
        connection.query(`SELECT NeedsDesc AS 'Needs', Timestamp
            FROM NeedsHistory
            WHERE VictimID = ?`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        });
    } else {
        response.fail('id not found', res)
    }
};

exports.shelterList = function (req, res) {
    connection.query(`SELECT ShelterID, Name, City, Latitude, Longitude
        FROM shelter`, function (error, rows, fields) {
        if (error) {
            console.log(error)
            response.fail(INTERNAL_ERROR, res)
        } else {
            response.ok(rows, res)
        }
    });
};

exports.index = function (req, res) {
    response.ok("Hello! You are currently connected to Shelter Management RESTful API Service", res)
};