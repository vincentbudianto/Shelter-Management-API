'use strict';

var response = require('./res');
var connection = require('./conn');
const INTERNAL_ERROR = 'Internal Server Error';

exports.createVictim = function (req, res) {
    var nik = req.body.nik;
    var nokk = req.body.nokk;
    var name = req.body.name;
    var age = req.body.age;
    var ids = req.body.shelterid;
    var photo;
	if (req.file != null) {
		photo = req.file.filename;
	} else {
		photo = "";
	}

    connection.query(
        `INSERT INTO victim (NIK, NoKK, Name, Age, Photo, CurrentShelterID) VALUES (?,?,?,?,?,?)`,
        [nik, nokk, name, age, photo, ids], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.victimByShelter = function (req, res) {
    const { id } = req.query;

    if (id) {
        connection.query(`SELECT DISTINCT VictimID, NIK, Name, ConditionStatus
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
        connection.query(`SELECT DISTINCT VictimID, NIK, Name, ConditionStatus
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

exports.victimByNoKK = function (req, res){
    const { nokk } = req.query;

    if (nokk) {
        connection.query(`SELECT DISTINCT VictimID, NIK, victim.Name, Status,
                ShelterID, shelter.name AS ShelterName, City, Province, Country
            FROM victim LEFT JOIN shelter ON victim.CurrentShelterID=shelter.ShelterID
            WHERE NoKK = ?`, [nokk], function (error, rows) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        });
    } else {
        response.fail('nokk not found', res)
    }
}

exports.victimByKeyword = function (req, res) {
    const { keyword } = req.query;

    if (keyword) {
        const searchKeyword = '%' + keyword + '%'
        connection.query(`SELECT DISTINCT VictimID, NIK, victim.Name, Status,
                ShelterID, shelter.name AS ShelterName, City, Province, Country
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
            FROM victim LEFT JOIN conditionhistory USING (VictimID)
                LEFT JOIN needshistory USING (VictimID)
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
            FROM shelterhistory LEFT JOIN shelter USING (ShelterID)
            WHERE VictimID = ?
            ORDER BY Timestamp DESC`, [id], function (error, rows, fields) {
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
    connection.query(`SELECT ConditionID AS 'ID', ConditionName as 'Name', ConditionDesc as 'Desc', ConditionStatus as 'Status', Timestamp
        FROM conditionhistory
        WHERE VictimID = ?
        ORDER BY Status DESC, Timestamp DESC`, [id], function (error, rows, fields) {
        if (error) {
            return callback(INTERNAL_ERROR)
        } else {
            return callback(null, rows)
        }
    });
};

exports.getVictimActiveConditionHistory = function (id, callback) {
    connection.query(`SELECT *
        FROM conditionhistory
        WHERE VictimID = ? AND ConditionStatus = 1
        ORDER BY Timestamp DESC`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            return callback(INTERNAL_ERROR)
        } else {
            return callback(null, rows)
        }
    });
};

exports.getVictimNeedHistory = function (id, callback) {
    connection.query(`SELECT NeedHistoryID as 'ID', NeedDesc AS 'Needs', Urgency, NeedStatus AS 'Status', Timestamp
        FROM needshistory
        WHERE VictimID = ?
        ORDER BY Status DESC, Timestamp DESC`, [id], function (error, rows, fields) {
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
        FROM needshistory
        WHERE VictimID = ? AND NeedStatus = 1
        ORDER BY Timestamp DESC`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                return callback(INTERNAL_ERROR);
            } else {
                return callback(null, rows);
            }
    });
};

exports.changeVictimNeedStatus = function (id, status, callback) {
    connection.query(
        `UPDATE needshistory
        SET NeedStatus = ?
        WHERE NeedHistoryID = ?`, [status, id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                return callback(INTERNAL_ERROR);
            } else {
                return callback(null, { value: true });
            }
        }
    );
}

exports.changeVictimConditionStatus = function (id, status, callback) {
    connection.query(
        `UPDATE conditionhistory
        SET ConditionStatus = ?
        WHERE ConditionID = ?`, [status, id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                return callback(INTERNAL_ERROR);
            } else {
                return callback(null, { value: true });
            }
        }
    );
}

exports.shelterList = function (req, res) {
    connection.query
    (`SELECT *
    FROM shelter`,
    function (error, rows, fields) {
        if (error) {
            console.log(error)
            response.fail(INTERNAL_ERROR, res)
        } else {
            response.ok(rows, res)
        }
    });
};

exports.shelterListName = function (req, res) {
    connection.query
    (`SELECT * FROM shelter`,
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
    var photo;
	if (req.file != null) {
		photo = req.file.filename;
	} else {
		photo = "";
	}
	let type = "Staff";

    connection.query(
        `INSERT INTO account (Username, Password, Type, NIK, NoKK, Name, Age, Photo, CurrentShelterID) VALUES (?,?,?,?,?,?,?,?,?)`,
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
        `SELECT * FROM account WHERE Username = ? AND Password = ?`,
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

exports.checkUsername = function (req, res) {
    let username = req.body.username;

    connection.query(
        `SELECT * FROM account WHERE Username = ?`,
        [username], function (error, rows, fields) {
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
    connection.query(`SELECT *
        FROM disaster LEFT JOIN (SELECT
            DisasterID, DisasterConditionStatus AS Status,
                DisasterConditionTitle AS ConditionTitle,
                DisasterConditionDesc AS ConditionDesc, Timestamp
            FROM disasterconditionhistory AS hist1
            WHERE Timestamp = (SELECT MAX(Timestamp)
                FROM disasterconditionhistory AS hist2
                WHERE hist1.DisasterID = hist2.DisasterID)
        ORDER BY Timestamp) AS conditionStatus
        USING (DisasterID)
        ORDER BY Status DESC, Timestamp DESC`,
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
        select VictimID, Age as VictimAge, CurrentShelterID as ShelterID, DisasterID
        from (
            victim JOIN shelter
            ON victim.CurrentShelterID = shelter.ShelterID
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
        `UPDATE victim SET CurrentShelterID = ? WHERE VictimID = ?`, [shelterId, id], function (error, rows, fields) {
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
    let updated = req.body.updated;

    connection.query(
      `INSERT INTO conditionhistory (VictimID, ConditionName, ConditionDesc, ConditionStatus, UpdatedBy) VALUES (?,?,?,?,?)`,
      [id, conditionName, conditionDesc, conditionStatus, updated],
      function (error, rows, fields) {
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
    let NeedStock = req.body.needStock;
    let NeedStatus = req.body.needStatus;
    let NeedImportance = req.body.needImportance;
    let updated = req.body.updated;

    connection.query(
      `INSERT INTO needshistory (VictimID, NeedDesc, NeedStockID, NeedStatus, Urgency, UpdatedBy) VALUES (?,?,?,?,?,?)`,
      [id, NeedDesc, NeedStock, NeedStatus, NeedImportance, updated],
      function (error, rows, fields) {
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
        `INSERT INTO disasterconditionhistory (DisasterID, DisasterConditionTitle, DisasterConditionDesc, DisasterConditionStatus) VALUES (?,?,?,?)`, [id, disasterTitle, disasterDesc, disasterStatus], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.getShelter = function (id, callback) {
    connection.query(`SELECT ShelterID, shelter.Name AS Name, District, City, Province, Country, shelter.Longitude, shelter.Latitude,
            DisasterID, disaster.Name AS DisasterName, Scale
        FROM shelter LEFT JOIN disaster USING (DisasterID)
        WHERE ShelterID= ?`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            return callback(INTERNAL_ERROR);
        } else {
            return callback(null, rows[0]);
        }
    });
}

exports.getShelterVictimList = function (id, callback) {
    connection.query(`SELECT VictimID, NIK, victim.Name, Status
        FROM shelter JOIN victim ON shelter.ShelterID=victim.CurrentShelterID
        WHERE ShelterID= ?`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            return callback(INTERNAL_ERROR);
        } else {
            return callback(null, rows);
        }
    });
}

exports.getShelterStock = function (id, callback) {
    connection.query(`SELECT StockID AS Id, stock.Name, Description, Amount
        FROM shelter JOIN shelterstock USING (ShelterID) JOIN stock USING (StockID)
        WHERE ShelterID= ?`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            return callback(INTERNAL_ERROR);
        } else {
            return callback(null, rows);
        }
    });
}

exports.getShelterConditionHistory = function (id, callback) {
    connection.query(`SELECT ShelterConditionID AS Id,
            ShelterConditionTitle AS Title,
            ShelterConditionDesc AS Description,
            ShelterConditionStatus AS Status,
            Timestamp, UpdatedBy
        FROM shelter JOIN shelterconditionhistory USING (ShelterID)
        WHERE ShelterID= ?
        ORDER BY Status DESC, Timestamp DESC`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            return callback(INTERNAL_ERROR);
        } else {
            return callback(null, rows);
        }
    });
}

exports.getShelterNeedHistory = function (id, callback) {
    connection.query(`SELECT ShelterNeedHistoryID AS Id,
            ShelterNeedDesc AS Description,
            ShelterNeedStatus AS Status,
            NeedStockID, stock.Name AS NeedStockName,
            Timestamp, UpdatedBy
        FROM shelter JOIN shelterneedshistory USING (ShelterID)
            JOIN stock ON shelterneedshistory.NeedStockID=stock.StockID
        WHERE ShelterID = ?
        ORDER BY Status DESC, Timestamp DESC`, [id], function (error, rows, fields) {
        if (error) {
            console.log(error)
            return callback(INTERNAL_ERROR);
        } else {
            return callback(null, rows);
        }
    });
}

exports.shelterNeeds = function (req, res) {
    const {id} = req.query;

    connection.query(
        `SELECT * FROM (SELECT VictimID, Name, NeedsDesc FROM victim NATURAL JOIN needshistory
        WHERE CurrentShelterID = ? ORDER BY Timestamp DESC) as tempTable GROUP BY VictimID`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.changeShelterNeedStatus = function (id, status, callback) {
    connection.query(
        `UPDATE shelterneedshistory
        SET ShelterNeedStatus = ?
        WHERE ShelterNeedHistoryID = ?`, [status, id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                return callback(INTERNAL_ERROR);
            } else {
                return callback(null, { value: true });
            }
        }
    );
}

exports.changeShelterConditionStatus = function (id, status, callback) {
    connection.query(
        `UPDATE shelterconditionhistory
        SET ShelterConditionStatus = ?
        WHERE ShelterConditionID = ?`, [status, id], function (error, rows, fields) {
            if (error) {
                console.log(error)
                return callback(INTERNAL_ERROR);
            } else {
                return callback(null, { value: true });
            }
        }
    );
}

exports.configs = function (req, res){
    connection.query(`SELECT SearchFilter FROM configs`, function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        }
    );
}
exports.updateConfigs = function (req, res){
    let searchFilter = req.body.SearchFilter;
    connection.query(`UPDATE configs SET SearchFilter = ? WHERE configs.index = 1`,[searchFilter], function (error, rows, fields) {
            if (error) {
                console.log(error)
                response.fail(INTERNAL_ERROR, res)
            } else {
                response.ok(rows, res)
            }
        }
    );
};

exports.updateShelterCondition = function (req, res) {
    let id = req.body.id;
    let shelterTitle = req.body.shelterTitle;
    let shelterDesc = req.body.shelterDesc;
    let updated = req.body.updated;

    connection.query(
        `INSERT INTO shelterconditionhistory (ShelterID, ShelterConditionTitle, ShelterConditionDesc, ShelterConditionStatus, UpdatedBy) VALUES (?,?,?,1,?)`, [id, shelterTitle, shelterDesc, updated], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.shelterCondition = function (req, res) {
    const {id} = req.query;

    connection.query(
        `SELECT * FROM (SELECT VictimId as id, Name as name, ConditionName as conditionName, ConditionStatus as status FROM victim NATURAL JOIN conditionhistory
            WHERE CurrentShelterID = ? ORDER BY Timestamp DESC) as tempTable GROUP BY id`, [id], function (error, rows, fields) {
            if (error) {
                console.log(error);
                response.fail(INTERNAL_ERROR, res);
            } else {
                response.ok(rows, res);
            }
        }
    );
}

exports.updateShelterNeeds = function (req, res) {
    let id = req.body.id;
    let shelterNeed = req.body.shelterNeed;
    let shelterStock = req.body.shelterStock;
    let updated = req.body.updated;

    connection.query(
        `INSERT INTO shelterneedshistory (ShelterID, ShelterNeedDesc, NeedStockID, ShelterNeedStatus, UpdatedBy) VALUES (?,?,?,1,?)`, [id, shelterNeed, shelterStock, updated], function (error, rows, fields) {
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
        FROM shelterstock JOIN stock USING (StockID)
            LEFT JOIN shelter USING (ShelterID)`, function (error, rows, fields) {
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
            FROM needshistory
            WHERE NeedStatus = 1) AS ActiveNeeds
            USING (VictimID) JOIN (SELECT StockID, ShelterID AS RecommendedShelterID, shelter.Name AS RecommendedShelterName
            FROM shelterstock LEFT JOIN shelter
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

exports.listAccount = function (req, res) {
    connection.query
    (`SELECT AccountID, Username, Name FROM account WHERE Type = 'staff'`,
    function (error, rows, fields) {
        if (error) {
            console.log(error)
            response.fail(INTERNAL_ERROR, res)
        } else {
            response.ok(rows, res)
        }
    });
};

exports.assignStaff = function (req, res) {
	let aid = req.body.accountid;
	let sid = req.body.shelterid;

    connection.query
    (`UPDATE account SET CurrentShelterID = ? WHERE AccountID = ?`,
	[sid, aid], function (error, rows, fields) {
        if (error) {
            console.log(error)
            response.fail(INTERNAL_ERROR, res)
        } else {
            response.ok(rows, res)
        }
    });
};

exports.getStockList = function (req, res) {
    connection.query(`SELECT StockID as Id, Name
        FROM stock`, function (error, rows, fields) {
        if (error) {
            console.log(error);
            response.fail(INTERNAL_ERROR, res);
        } else {
            response.ok(rows, res);
        }
    });
}

exports.index = function (req, res) {
    response.ok("Hello! You are currently connected to Shelter Management RESTful API Service", res)
};