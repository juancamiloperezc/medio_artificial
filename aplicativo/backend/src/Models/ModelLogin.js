const  database = require('../database/dbconnect') 
const  mysql = require('mysql')

// clase modelos para el registro y el inicio de sesión
class ModelLogin{
    // método para buscar un email en la base de datos
    searchEMail(email, callback){
     const connection = database.connection();
     connection.connect(err => {
         if (err){
            callback(err, null);
            return;
         }
     });

    // se realiza el query para la busqueda 
    connection.query("SELECT * FROM usuarios WHERE email = " + mysql.escape(email), callback);
    connection.end(); // se cierra la conexión
   }

   register(data, callback){
      const connection = database.connection(); // se obtiene la conexión a la base de datos
      connection.connect(err => {
         if (err){
            callback(err, null);
            return;
         }
      });
      
      // se realiza la consulta sql para ingresar los datos
      connection.query(`INSERT INTO usuarios (nombres, apellidos, email, celular, rol, clave)
                        VALUES ?`, [data], callback);
      connection.end();
   }

   changePassword(data, callback){
      const connection = database.connection(); 
      connection.connect( err => {
         if (err){
            callback(err, null);
            return;
         }
      });

      // se realiza la consulta para hacer la modificación
      connection.query(`UPDATE usuarios SET clave = '${data.pass}' WHERE email = ` + mysql.escape(data.email), callback);
      connection.end();
   }
}

module.exports = ModelLogin;