const Model = require('../Models/ModelMeditions');

// controlador para recibir y enviar los datos de las mediciones
class ControllerMeditions{
  searchForPosition(req, res){
   const model = new Model();

   // se recupera la posición consultada
   let pos = req.query.pos; 
   
   model.searchForPosition(pos, (err, data) =>{

      if(err){
         console.log("error en la consulta: " + err);
         res.status(500).json({exist: false, data: null});
         return;
      }

      // en caso de que no haya error se verifican los datos
      if (data.length == 0){
         console.log("existe el colino: " + data)
         res.status(200).json({exist: true, data: null});
         return;
      }

      res.status(200).json({exist: true, data: data[0]})
      console.log("id: " + data[0].id);
   });
  } 

  saveNewTemp(req, res){
     const model = new Model();

     // se obtiene el puesto del colino registrado
     let pos = req.body.position;
     
     model.searchForPosition(pos, (err, data) =>{
         if(err){
            console.log("error: " + err);
            res.status(404).json({exist:false, data:null});
            return;
         }

         if(data.length == 0){
            console.log("no existe el colino");
            res.status(200).json({exist: false, data: null});
            return;
         }

         let id = data[0].id;
         
         // se verifica si existe el colino y si es activo
         model.searchForId(id, (err, data) =>{
            if (err){
               console.log("error: " + err);
               res.status(500).json({exist: false, data: null});
               return;
            }

            if (data.length == 0 || data[0].colino_activo == 0){
               console.log("el colino no existe");
               res.status(404).json({exist: false, data: null});
               return;
            } 
            
            let date = new Date();
            let currentDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
            let currentTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            // en caso de que exista el colino se envían los datos
            let payload = [
               [id, currentDate,currentTime, req.body.medicion]
            ];

            // se envía el query para guardar los datos
            model.saveNewTemp(payload, (err, data) => {
               if(err){
                  console.log("error: " + err);
                  res.status(500).json({isOk: false});
                  return;
               }

               res.status(200).json({isOk: true}); 
            });
         });

      });
  }

  saveNewHum(req, res){
   const model = new Model();

   // se obtiene el puesto del colino registrado
   let pos = req.body.position;
   
   model.searchForPosition(pos, (err, data) =>{
       if(err){
          console.log("error: " + err);
          res.status(404).json({exist:false, data:null});
          return;
       }

       if(data.length == 0){
          console.log("no existe el colino");
          res.status(200).json({exist: false, data: null});
          return;
       }

       let id = data[0].id;
       
       // se verifica si existe el colino y si es activo
       model.searchForId(id, (err, data) =>{
          if (err){
             console.log("error: " + err);
             res.status(500).json({exist: false, data: null});
             return;
          }

          if (data.length == 0 || data[0].colino_activo == 0){
             console.log("el colino no existe");
             res.status(404).json({exist: false, data: null});
             return;

          }
          
          let date = new Date();
          let currentDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
          let currentTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

          // en caso de que exista el colino se envían los datos
          let payload = [
             [id, currentDate,currentTime, req.body.medicion]
          ];

          // se envía el query para guardar los datos
          model.saveNewHum(payload, (err, data) => {
             if(err){
                console.log("error: " + err);
                res.status(500).json({isOk: false});
                return;
             }

             res.status(200).json({isOk: true});
          });
       });

    });

   }
}

module.exports = ControllerMeditions;