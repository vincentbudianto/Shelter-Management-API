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
                NeedDesc AS 'Needs', Photo
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

exports.getVictimConditionHistory = function (id, callback) {
    connection.query(`SELECT ConditionName as 'Name', ConditionDesc as 'Desc', ConditionStatus as 'Status', Timestamp
        FROM ConditionHistory
        WHERE VictimID = ?`, [id], function (error, rows, fields) {
        if (error) {
            return callback(INTERNAL_ERROR)
        } else {
            return callback(null, rows)
        }
    });
};

exports.getVictimActiveConditionHistory = function (id, callback) {
    connection.query(`SELECT *
        FROM ConditionHistory
        WHERE VictimID = ? AND ConditionStatus = 1`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            return callback(INTERNAL_ERROR)
        } else {
            return callback(null, rows)
        }
    });
};

exports.getVictimNeedHistory = function (id, callback) {
    connection.query(`SELECT NeedDesc AS 'Needs', Timestamp
        FROM NeedsHistory
        WHERE VictimID = ?`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                return callback(INTERNAL_ERROR);
            } else {
                return callback(null, rows);
            }
    });
};

exports.getVictimActiveNeedHistory = function (id, callback) {
    connection.query(`SELECT *
        FROM NeedsHistory
        WHERE VictimID = ? AND NeedStatus = 1`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                return callback(INTERNAL_ERROR);
            } else {
                return callback(null, rows);
            }
    });
};

exports.shelterList = function (req, res) {
    connection.query
    (`SELECT *
    FROM shelter
    JOIN (SELECT DisasterID, Name as DisasterName FROM disaster) as temp_disaster
    ON shelter.DisasterID = temp_disaster.DisasterID`,
    function (error, rows, fields) {
        if (error) {
            console.log(error)
            response.fail(INTERNAL_ERROR, res)
        } else {
            response.ok(rows, res)
        }
    });
};

exports.register = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let nik = req.body.nik;
    let nokk = req.body.nokk;
    let name = req.body.name;
    let age = req.body.age;
	let shelterid = req.body.shelterid;
    let photo = req.file.filename;
	let type = "staff";

    connection.query(
        `INSERT INTO Account (Username, Password, Type, NIK, NoKK, Name, Age, Photo, CurrentShelterID) VALUES (?,?,?,?,?,?,?,?,?)`,
        [username, password, type, nik, nokk, name, age, photo, shelterid], function (error, rows, fields) {
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
    let username = req.body.username;
    let password = req.body.password;

    connection.query(
        `SELECT * FROM Account WHERE Username = ? AND Password = ?`,
        [username, password], function (error, rows, fields) {
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
    let disasterID = req.body.disasterID;
    let name = req.body.name;
    let district = req.body.district;
    let city = req.body.city;
    let province = req.body.province;
    let country = req.body.country;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    connection.query(
      `INSERT INTO shelter (DisasterID, Name, District, City, Province, Country, Latitude, Longitude) values (?,?,?,?,?,?,?,?)`,
      [disasterID, name, district, city, province, country, latitude, longitude], function(error, rows, fields) {
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

exports.dashboardData = function (req, res) {
    connection.query(
        `
        select *
        from (
            (
                (
                    select VictimID, Age as VictimAge, CurrentShelterID
                    from victim
                ) as victim_dashboard
                JOIN
                (
                    select *
                    from (
                            (select shelter.ShelterID as ShelterID
                            from shelter) as shelter_dash JOIN
                            ( select disaster.DisasterID as DisasterID
                            from disaster) as disaster_dash
                        on shelter_dash.ShelterID = disaster_dash.DisasterID
                    )
                ) as shelter_disaster_dashboard
                on victim_dashboard.CurrentShelterID = shelter_disaster_dashboard.ShelterID
            )
        );
        `,
    function (error, rows){
        if (error) {
            console.log(error)
            response.fail(INTERNAL_ERROR, res)
        } else {
            response.ok(rows, res)
        }
    })
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
    let NeedDesc = req.body.conditionName;

    connection.query(
        `INSERT INTO NeedsHistory (VictimID, NeedDesc) VALUES (?,?)`, [id, NeedDesc], function (error, rows, fields) {
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

exports.updateShelterCondition = function (req, res) {
    let id = req.body.id;
    let shelterTitle = req.body.shelterTitle;
    let shelterDesc = req.body.shelterDesc;
    let shelterStatus = req.body.shelterStatus;
    let updated = req.body.updated;

    connection.query(
        `INSERT INTO ShelterConditionHistory (ShelterID, ShelterConditionTitle, ShelterConditionDesc, ShelterConditionStatus, UpdatedBy) VALUES (?,?,?,?,?)`, [id, shelterTitle, shelterDesc, shelterStatus, updated], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.updateShelterNeeds = function (req, res) {
    let id = req.body.id;
    let shelterNeed = req.body.shelterNeed;
    let shelterStock = req.body.shelterStock;
    let updated = req.body.updated;

    connection.query(
        `INSERT INTO ShelterNeedHistory (ShelterID, ShelterNeedDesc, NeedStockID, UpdatedBy) VALUES (?,?,?,?)`, [id, shelterNeed, shelterStock, updated], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
}

exports.isStaff = function (id, callback) {
    connection.query(`SELECT AccountID
        FROM account
        WHERE AccountID= ? AND Type = 'Staff'`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error)
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

exports.isStaffShelter = function (staffId, shelterId, callback) {
    connection.query(`SELECT AccountID
        FROM account JOIN shelter ON account.CurrentShelterID=shelter.ShelterID
        WHERE AccountID = ? AND ShelterID = ? AND Type = 'Staff'`, [staffId, shelterId], function (error, rows, fields) {
        if (error) {
            console.log(error)
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

exports.isAdmin = function (id, callback) {
    connection.query(`SELECT AccountID
        FROM account
        WHERE AccountID = ? AND Type = 'Admin'`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error);
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

exports.getAllVictim = function (callback) {
    connection.query(`SELECT *
        FROM victim`, function (error, rows, fields) {
        if (error) {
            return callback(INTERNAL_ERROR);
        } else {
            return callback(null, rows);
        }
    });
}

exports.getAllShelterWithStock = function (callback) {
    connection.query(`SELECT *
        FROM shelterStock LEFT JOIN shelter USING (ShelterID)`, function (error, rows, fields) {
        if (error) {
            console.log(error);
            return callback(INTERNAL_ERROR);
        } else {
            return callback(null, rows);
        }
    });
}

exports.getAllRecommendation = function (callback) {
    connection.query(`SELECT VictimID, NIK, victim.Name AS Name, NeedDesc, StockID,
            CurrentShelterID, CurrentShelterName, RecommendedShelterID, RecommendedShelterName, Urgency
        FROM victim RIGHT JOIN (SELECT *
            FROM needsHistory
            WHERE NeedStatus = 1) AS ActiveNeeds
            USING (VictimID) JOIN (SELECT StockID, ShelterID AS RecommendedShelterID, shelter.Name AS RecommendedShelterName
            FROM shelterStock LEFT JOIN shelter
            USING (ShelterID)) AS AvailableStock
            ON NeedStockID=AvailableStock.StockID JOIN (SELECT ShelterID, Name AS CurrentShelterName
            FROM shelter) AS ShelterList
            ON CurrentShelterID=ShelterList.ShelterID`, function (error, rows, fields) {
        if (error) {
            console.log(error);
            return callback(INTERNAL_ERROR);
        } else {
            return callback(null, rows);
        }
    });
}

exports.index = function (req, res) {
    response.ok("Hello! You are currently connected to Shelter Management RESTful API Service", res)
};