const mysql = require('mysql');
const database = require('../database/databaseMySql');

// modelos de las mediciones
class ModelMeditions{
  // método para buscar un colino por la posición 
  searchForPosition(pos, callback){
     const connection = database.connection();
     connection.connect(err => {
        if (err){
          callback(err, null);
           return;
        }

       }); 
       
       // se hace la consulta en la tabla colinos por el puesto
       connection.query(`SELECT MAX(id) AS id 
                         FROM colino WHERE posicion = ` 
                         + mysql.escape(pos), callback);
       connection.end();
  }

  searchForId(id, callback){
   const connection = database.connection();
   connection.connect(err => {
      if (err){
        callback(err, null);
         return;
      }

     }); 
     
     // se hace la consulta en la tabla colinos por el puesto
     connection.query(`SELECT * FROM colino WHERE id = ` 
                       + mysql.escape(id), callback);
     connection.end();
  }

  saveNewTemp(data, callback){
    const connection = database.connection();
    connection.connect(err=>{
        if (err) {
         callback({complete: false, error: err})
         return;
        }
    });

    // se realiza la consulta sql para ingresar los datos
    connection.query(`INSERT INTO medicion_temperaturas (id_colino, fecha_medicion, hora_medicion, medicion)
                      VALUES ?`, [data], callback);
    connection.end();                  
 }

 saveNewHum(data, callback){
  const connection = database.connection();
  connection.connect(err=>{
      if (err) {
       callback({complete: false, error: err})
       return;
      }
  });

  // se realiza la consulta sql para ingresar los datos
  connection.query(`INSERT INTO medicion_humedades (id_colino, fecha_medicion, hora_medicion, medicion)
                    VALUES ?`, [data], callback);
  connection.end();                  
 }
}

module.exports = ModelMeditions;