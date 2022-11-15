const  database = require('../database/dbconnect') 
const  mysql = require('mysql')

class ModelHome{
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
}

module.exports = ModelHome;