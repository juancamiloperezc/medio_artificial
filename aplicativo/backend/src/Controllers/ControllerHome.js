const jwt = require('jsonwebtoken')


const Model = require('../Models/ModelHome')

class ControllerHome{
   isAuth(req, res, next){
      // se recupera el token para la autenticación
      let token = req.headers["authorization"];
      
      // se verifica la autenticidad el token
      if (token == null){
         res.status(401).json({auth: false});
         console.log("token no identificado");
         return;
      }else{
         //se envían datos de validación al cliente
         jwt.verify(token, process.env.JWT_SECRET, (err, dataUser) =>{
            if (err){
               res.status(500).json({auth: false});
               console.log("error de auth : "+ err);
               return;
            }
         });
      }

      next();
   }

   getMeasures(req, res){
      const model = new Model();
      // se revisan los filtros para hacer la consulta
      let filter = req.body.filter.filters;

      if (filter.length == 0){
         // se hace la consulta de todos los datos
         model.getAllMeasures((err, data) => { 
            if (err){
               console.log(err);
               res.status(500).json({auth: false});
               return;
            }

            res.status(200).json({auth: true, data: data});
         });   
      }else{
         model.getFilterMeasures(filter, (err, data) => {
             if (err){
                console.log(err);
                res.status(500).json({auth:false});
                return;
             }
             
             res.status(200).json({auth:true, data: data});
             console.log(data)
         });
      }
   }
};

module.exports = ControllerHome;