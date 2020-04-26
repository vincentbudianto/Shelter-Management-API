var mysql = require('mysql');

if (process.env.JAWSDB_URL) {
  var con = mysql.createConnection(process.env.JAWSDB_URL);
  console.log("Heroku");
} else {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shelter_management"
  });
  console.log("Local");
};

con.connect(function (err) {
  if (err) {
    console.log("Error");
    throw err;
  } else {
    console.log("Connected");
  }
});

module.exports = con;