const mysql = require('mysql');

exports.connection = () => {
  const conn = mysql.createConnection({
    host: process.env.HOST_DB || "localhost",
    user: process.env.USER_DB || "root", 
    port: process.env.PORT_DB || 3306,
    database: process.env.NAME_DB || "medio_artificial" 
  });

  return conn;
}