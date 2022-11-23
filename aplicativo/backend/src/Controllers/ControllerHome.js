const jwt = require('jsonwebtoken');

const ModelHome = require('../Models/ModelHome')
const ModelLogin = require('../Models/ModelLogin')

class ControllerHome {
   isAuth(req, res, next) {
      // se recupera el token para la autenticación
      let token = req.headers["authorization"];
   
      // se verifica la autenticidad el token
      if (token == null) {
         res.status(401).json({ auth: false });
         console.log("token no identificado");
         return;
      } else {
         //se envían datos de validación al cliente
         jwt.verify(token, process.env.JWT_SECRET, (err, dataUser) => {
            if (err) {
               res.status(500).json({ auth: false });
               console.log("error de auth : " + err);
               return;
            }
         });
      }
   
      next();
   }

   searchId(req, res){
      const modelLogin = new ModelLogin();
      let email = req.body.email; // se recupera el gmail
      let rol = req.body.rol;

      // se consulta el email
      modelLogin.searchEMail(email, (err, data) =>{
         if (err){
            res.status(500).json({exist:false})
            console.log("error ", err);
            return;
         }

         if (data.length == 0){
            res.status(200).json({exist:false});
            console.log("no existe");
            return;
         }

         if (data[0].rol != rol){
            res.status(200).json({exist: false});
            return;
         }
         
         res.status(200).json({exist: true, id:data[0].id});
      });
   }

   searchEmail(req, res){
      const modelHome = new ModelHome();
      modelHome.searchEmail(req.body.id, (err, data) =>{
         if (err){
            res.status(500).json({exist: false});
            return;
         }

         if(data.length == 0){
            res.status(200).json({exist: false});
            return;
         }

         res.status(200).json({exist: true, data});

      });
   }

   // método para añadir una nueva propiedad
   addNewPropertie(req, res) {
      // solo se puede aceptar al rol de dueño o jefe
      // se obtiene la consulta del email del jefe 
      const modelHome = new ModelHome();  
      const modelLogin = new ModelLogin();
      // se configura los datos a registrar
      let data = [
         [req.body.nombre, req.body.direccion, req.body.id_jefe, req.body.id_ingeniero, req.body.id_agricultor]
      ];

         
      modelHome.addNewProperty(data, (err, data) =>{
         if (err){
            res.status(500).json({created:false});body
            return;
         }

         res.status(200).json({created: true});
      });
   }  

   // método de consulta para todos 
   consultAllProperties(req, res){
       const modelHome = new ModelHome();

       // se realiza la consulta de todas las propiedades a las que se está registrado
       modelHome.getAllProperties({id:req.body.id}, (err, data) => {
          if (err){
             res.status(500).json({data:[]});
             return;
          }

           res.status(200).json({data});
       });
   }

   consultPropertie(req, res){
      const modelHome = new ModelHome();

      // se realiza la consulta de todos los datos para la propiedad específica
      modelHome.getPropertie(req.body.id, (err, data) =>{
         if (err){
             res.status(500).json({data:[]});
             return;
         }

         res.status(200).json({data});
      });
   }

   // método para consultar los colinos de una tabla por su id
   consultPropertieMeasureColino(req, res){
      const modelHome = new ModelHome();
      modelHome.consultPropertieMeasureColino(req.body.id, (err, data) =>{
         if (err){
            res.status(500).json({data: []})
            return;
         }

         res.status(200).json({data})
      })
   }

   consultMeasureColino(req, res){
      const modelHome = new ModelHome();
      console.log(req.body.id)

      let filters = [{
         filters:[
            {id: req.body.id}
         ]
      }]

      modelHome.getFilterMeasures(filters, (err, data) =>{
         if(err){
            res.status(500).json({data: []});
            return;
         }

         res.status(200).json({data: data});

      });
   }

   // método para añadir nuevo colino
   addColino(req, res){
      const modelHome = new ModelHome();  
      const modelLogin = new ModelLogin();
      // se configura los datos a registrar
      let dataColino = [
         [req.body.id, req.body.posicion, req.body.fecha_ingreso, req.body.tam_inicial, 1]
      ];

      modelHome.getPropertie(req.body.id, (err, data) => { // se revisa si la propiedad existe

         if (err){
            res.status(500).json({created: false});
            return;
         }

         if (data.lenght == 0){
            res.status(500).json({created: false});
            return;
         }

         modelHome.addNewColino(dataColino, (err, data) =>{
            if (err){
               res.status(500).json({created:false});
               return;
            }
            

            res.status(200).json({created: true});
         });
      })   
   }
   
};

module.exports = ControllerHome;