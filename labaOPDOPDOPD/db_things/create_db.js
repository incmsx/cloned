const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});
//тут все тривиально
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query("CREATE DATABASE opdopdopd", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
});