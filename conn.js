var mysql = require('mysql');

if (process.env.JAWSDB_URL) {
  con = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shelter_management"
  });
};

con.connect(function (err) {
    if (err) throw err;
});

module.exports = con;