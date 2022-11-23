const  database = require('../database/dbconnect') 
const  mysql = require('mysql')

class ModelHome{
   // método para hacer la consulta de ingresar nueva propiedad
   addNewProperty(data, callback){
      const connection = database.connection(); // se obtiene la conexión a la base de datos
      connection.connect(err => {
         if (err){
            callback(err, null);
            return;
         }
      });

      
      // se realiza la consulta sql para ingresar los datos
      connection.query(`INSERT INTO fincas (nombre, direccion, id_jefe, id_ingeniero, id_agricultor)
                        VALUES ?`, [data], callback);
      connection.end();
   }

   searchEmail(id, callback){
      const connection = database.connection();
      connection.connect(err => {
         if (err){
            callback(err, null);
            return;
         }
      });

      connection.query(`SELECT email FROM usuarios WHERE id = ${mysql.escape(id)}`, callback);
      connection.end();
   }

   // método para obtener los datos de una propiedad específica
   getPropertie(id, callback){
      const connection = database.connection();
      connection.connect(err => {
         if (err){
            callback(err, null);
            return;
         }
      });

      // se hace la consulta
      connection.query(`SELECT * from fincas WHERE id = ${mysql.escape(id)}`, callback);
      connection.end();
   }

   // método para pbtener la consulta de todas las propiedades de un usuario
   getAllProperties(data, callback){
      const connection = database.connection();
      connection.connect(err => {
         if (err){
            callback(err, null);
            return;
         }
      });

      // se hace la consulta
      connection.query(`SELECT * from fincas WHERE id_jefe = ${mysql.escape(data.id)} 
                        OR id_ingeniero = ${mysql.escape(data.id)} 
                        OR id_agricultor = ${mysql.escape(data.id)}`, callback);
      connection.end();
   }

  // método para hacer la consulta a la bd de todas las mediciones 
  getAllMeasures(callback){
     const connection = database.connection();
     connection.connect(err => {
        if (err){
          callback(err, null);
          return;
        }
     });

     connection.query("SELECT t.id, t.id_colino, t.fecha_medicion, t.hora_medicion,t.medicion as medicion_temp, h.medicion as medicion_hum FROM medicion_humedades h,medicion_temperaturas t WHERE t.id = h.id;", 
                       callback);
     connection.end();
  }

  // método para consultar los datos de una propiedad
  consultPropertieMeasure(id, callback){
      const connection = database.connection();
      connection.connect(err => {
         if (err){
         callback(err, null);
         return;
         }
      });

      connection.query("SELECT t.id, t.id_colino, t.fecha_medicion, t.hora_medicion,t.medicion as medicion_temp, h.medicion as medicion_hum FROM medicion_humedades h,medicion_temperaturas t WHERE t.id = h.id;", 
                        callback);
      connection.end();
  }

  getFilterMeasures(filters, callback){
      const connection = database.connection();
      connection.connect(err => {
         if (err){
            callback(err, null);
            return;
         }
      });


      let query = `SELECT t.id, t.id_colino, t.fecha_medicion, t.hora_medicion,t.medicion as medicion_temp, h.medicion as medicion_hum 
                   FROM medicion_humedades h,medicion_temperaturas t 
                   WHERE t.id = h.id`

      if (filters[0].filters.find(obj => obj.id) != undefined){
          query += ` AND t.id_colino = ${filters[0].filters[0].id}`;
      }

      if (filters[0].filters.find(obj => obj.fecha_medicion) != undefined){
          query += ` AND t.fecha_medicion = '${filters[0].filters[1].fecha_medicion}'`
      }

      query += ";";
      
      connection.query(query, callback);
      connection.end();
  }

  getLastMeasures(callback){
      const connection = database.connection();
      connection.connect(err=>{
         if (err){
            callback(err, null);
            return;
         }

         // se realiza la consulta de las últimas lecturas
         let query = `SELECT t.id_colino, t.fecha_medicion, t.hora_medicion, t.medicion as medicion, h.medicion as medicion_h 
                      FROM medicion_temperaturas t, medicion_humedades h WHERE 
                      t.id = h.id ORDER BY t.id DESC LIMIT 1;`

         connection.query(query, callback);
         connection.end();             
      });
  }

  consultPropertieMeasureColino(id, callback){
      const connection = database.connection();
      connection.connect(err=>{
         if (err){
            callback(err, null);
            return;
         }

         // se realiza la consulta de las últimas lecturas
         let query = `SELECT * from colino WHERE id_finca = ${mysql.escape(id)};`
         
         connection.query(query, callback);
         connection.end();             
      });
  }

  addNewColino(data, callback){
      const connection = database.connection(); // se obtiene la conexión a la base de datos
      connection.connect(err => {
         if (err){
            callback(err, null);
            return;
         }
      });

      
      // se realiza la consulta sql para ingresar los datos
      connection.query(`INSERT INTO colino (id_finca, posicion, fecha_ingreso, tam_inicial, colino_activo)
                        VALUES ?`, [data], callback);
      connection.end();
  }
}

module.exports = ModelHome;