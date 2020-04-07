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
        }
    );
};

exports.register = function (req, res) {
    let id = req.body.id;
    let password = req.body.password;

    connection.query(
        `INSERT INTO user (UserID, Password) VALUES (?,?)`,
        [id, password], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.login = function (req, res) {
    let id = req.body.id;
    let password = req.body.password;

    connection.query(
        `SELECT * FROM user WHERE UserID = ? AND Password = ?`,
        [id, password], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.addShelter = function (req, res) {
    let name = req.body.name;
    let district = req.body.district;
    let city = req.body.city;
    let province = req.body.province;
    let country = req.body.country;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    connection.query(
      `INSERT INTO shelter (Name, District, City, Province, Country, Latitude, Longitude) VALUES (?,?,?,?,?,?,?)`,
      [name, district, city, province, country, latitude, longitude], function(error, rows, fields) {
        if (error) {
          console.log(error);
          response.fail(INTERNAL_ERROR, res);
        } else {
          response.ok(rows, res);
        }
      }
    );
};

exports.disasterList = function (req, res) {
    connection.query(`SELECT * FROM disaster`,
    function (error, rows, fields) {
        if (error) {
            console.log(error)
            response.fail(INTERNAL_ERROR, res)
        } else {
            response.ok(rows, res)
        }
    });
};

exports.addDisaster = function (req, res) {
    let name = req.body.name;
    let scale = req.body.scale;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    connection.query(
        `INSERT INTO disaster (Name, Scale, Latitude, Longitude) values (?, ?, ?, ?)`,
        [name, scale, latitude, longitude],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.faile(INTERNAL_ERROR, res);
            }
            else{
                response.ok(rows, res);
            }
        }
    )
}

exports.updateVictimShelter = function (req, res) {
    let id = req.body.id;
    let shelterId = req.body.shelterId;

    connection.query(
        `INSERT INTO ShelterHistory (VictimID, ShelterID) VALUES (?,?)`, [id, shelterId], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.updateVictimCondition = function (req, res) {
    let id = req.body.id;
    let conditionName = req.body.conditionName;
    let conditionDesc = req.body.conditionDesc;
    let conditionStatus = req.body.conditionStatus;

    connection.query(
        `INSERT INTO ConditionHistory (VictimID, ConditionName, ConditionDesc, ConditionStatus) VALUES (?,?,?,?)`, [id, conditionName, conditionDesc, conditionStatus], function (error, rows, fields) {
        if (error) {
            console.log(error);
            response.fail(INTERNAL_ERROR, res);
        } else {
            response.ok(rows, res);
        }
    }
    );
};

exports.updateVictimNeeds = function (req, res) {
    let id = req.body.id;
    let NeedsDesc = req.body.conditionName;

    connection.query(
        `INSERT INTO NeedsHistory (VictimID, NeedsDesc) VALUES (?,?)`, [id, NeedsDesc], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.updateDisasterConditions = function (req, res) {
    let id = req.body.id;
    let disasterTitle = req.body.disasterTitle;
    let disasterDesc = req.body.disasterDesc;
    let disasterStatus = req.body.disasterStatus;

    connection.query(
        `INSERT INTO DisasterConditionHistory (DisasterID, DisasterConditionTitle, DisasterConditionDesc, DisasterConditionStatus) VALUES (?,?,?,?)`, [id, disasterTitle, disasterDesc, disasterStatus], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.getStaff = function (id, callback) {
    connection.query(`SELECT StaffID
        FROM staff
        WHERE StaffID= ?`, [id], function (error, rows, fields) {
        if (error) {
            return callback(INTERNAL_ERROR);
        } else {
            if (rows[0]) {
                return callback(null, { isStaff: true });
            } else {
                return callback(null, { isStaff: false });
            }
        }
    });
}

exports.getStaffShelter = function (staffId, shelterId, callback) {
    connection.query(`SELECT StaffID
        FROM staff JOIN shelter ON staff.CurrentShelterID=shelter.ShelterID
        WHERE StaffID = ? AND ShelterID = ?`, [staffId, shelterId], function (error, rows, fields) {
        if (error) {
            return callback(INTERNAL_ERROR);
        } else {
            if (rows[0]) {
                return callback(null, { isStaffShelter: true });
            } else {
                return callback(null, { isStaffShelter: false });
            }
        }
    });
}

exports.getAdmin = function (id, callback) {
    connection.query(`SELECT AdminID
        FROM admin
        WHERE AdminID = ?`, [id], function (error, rows, fields) {
        if (error) {
            return callback(INTERNAL_ERROR);
        } else {
            if (rows[0]) {
                return callback(null, { isAdmin: true });
            } else {
                return callback(null, { isAdmin: false });
            }
        }
    });
}

exports.index = function (req, res) {
    response.ok("Hello! You are currently connected to Shelter Management RESTful API Service", res)
};