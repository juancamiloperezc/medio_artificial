const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const template = require('../Templates/templateForgotPassHTML')
const Model = require('../Models/ModelLogin')

// clase controlador para registro e inicio de sesión
class ControllerLogin{
  // método para realizar el resgitro de un usuario nuevo
  register(req, res){
     const model = new Model();
     
     // se verifica si el email ya se encuentra registrado o no
     let email = req.body.email;
     
     model.searchEMail(email, async (err, data) => {
       if (err){
          console.log("no se pudo realizar el registro");
          res.status(500).json({exist: false, register: false});
          return;
       }

       // se revisa si el usuario existe con anterioridad
       if (data.length != 0){
           res.status(202).json({exist: true, register: false});
           return;
       }
       
       // se obtiene la clave del usuario
       let pass = req.body.password;
       let passEnc = await bcryptjs.hash(pass, 8); 
       
       // se obtienen los datos a registrar
       let dataSend = [
          [req.body.names,req.body.lastNames,req.body.email,req.body.cell, req.body.rol, passEnc],
        ];

       // en caso de que el usuario no exista con anterioridad
       model.register(dataSend, (err, data) => {
          if (err){
             console.log("no se pudo realizar el registro " + err);
             res.status(500).json({exist: false, register: false});
             return;
          }

          console.log("se realizó el registro");
          res.status(201).json({exist: false, register: true});
          return;
       });

     });
  }

  // método para iniciar la sesión
  login(req, res){
    const model = new Model();

    // se busca si el email ya existe
    model.searchEMail(req.body.email, async (err, data) =>{
       if (err){
          console.log("no se pudo realizar el inicio de sesión");
          res.status(500).json({exist:false, login:false});
          return;
       }

       if (data.length == 0){ // si el usuario no existe
           console.log("El usuario no existe");
           res.status(401).json({exist: false, login: false});
           return;
       }

       // en caso de que el usuario exista se verifican las contraseñas
       if (await bcryptjs.compare(req.body.password, data[0].clave)){
          // se crea el token para la sesión
          let payload = {
            names: data[0].nombres, 
            lastNames: data[0].apellidos, 
            email: data[0].email,
            cell: data[0].celular, 
            rol: data[0].rol
          };

          console.log("credenciales correctas ");

          // se añade la sesión del token
          jwt.sign({payload}, process.env.JWT_SECRET , {expiresIn: '1d'}, (err, token) => {
              if (err){
                console.log("no se pudo autenticar el usuario " + err);
                res.status(500).json({exist: true, login: false});
                return;
              }

              res.status(200).json({exist:true,  login: true, token: token})  
          });
       }else { // en caso de credenciales incorrectas
          console.log("credenciales incorrectas");
          res.status(401).json({exist:true, login: false});
          return;
       }

    });
  }

  isAuth(req, res){ // método para verificar el inicio de sesión previo de un usuario
   // se recupera el token para la autenticación
      let token = req.headers["authorization"];
      
      // se verifica la autenticidad el token
      if (token == null){
         res.status(401).json({auth: false, data: null});
         console.log("token no identificado");
         return;
      }else{
         //se envían datos de validación al cliente
         jwt.verify(token, process.env.JWT_SECRET, (err, dataUser) =>{
            if (err){
               res.status(500).json({auth: false, data: null});
               console.log("error de auth : "+ err);
               return;
            }

            // si los email no coinciden
            if (dataUser.payload.email != req.body.email){
               res.status(401).json({auth: false, data: null});
               return;
            }

             res.status(200).json({auth: true, data: {...dataUser.payload}});
         });
      }
   }

   // método para enviar el email de recuperación de contraseña
   forgotpassword(req, res){
      const model = new Model();
      let url = req.headers['url'];
      let email = req.body.email;

      // se busca la información del usuario al cambiar contraseña
      model.searchEMail(email, (err, data) => {
          if (err){
             res.status(500).json({sendmail: false});
             console.log("error de recuperacion: ", err);
             return;
          }
          
          // se verifica la existencia del email
          if (data.length == 0){
              res.status(401).json({sendmail: false});
              console.log("el email no existe");
              return;
          }
         
          // se crea el payload para el token de recuperación
          let payload = {
            names: data[0].nombres, 
            lastNames: data[0].apellidos, 
            email: data[0].email,
            cell: data[0].celular, 
            rol: data[0].rol
          };

          // se añade la sesión del token
          jwt.sign({payload}, process.env.JWT_RECOVERY , {expiresIn: '5m'}, (err, token) => {
            if (err){
              console.log("no se pudo autenticar el usuario " + err);
              res.status(500).json({sendMail: false});
              return;
            }

            // se recibe el html a enviar
            let html = templateForgotPassHTML({
               names: data[0].nombres,
               lastnames: data[0].apellidos,
               link: url + `/${data[0].email}/${token}`
            });
            
            try{
               let transporter = nodemailer.createTransport({
                  host: 'smtp.gmail.com',
                  port: 465, 
                  secure: true,
                  auth: {
                     user: `${process.env.EMAIL}`,
                     pass: `${process.env.PASS}`
                  }
               });
               
               // se crea el mensaje y se envía
               transporter.sendMail({
                  from: process.env.EMAIL,
                  to: `${email}`,
                  subject: "recovery password",
                  html : html
               });
   
               res.status(200).json({sendMail: true});
            }catch(err){
               res.status(500).json({sendMail:false});
               console.log("error de email: ", err);
            }
            
         });
      });
   }

   // método para validar el token para la recuperación de la contraseña
   async recoveryPassword(req, res){
      let email = req.body.email;
      let token = req.body.token;
      let pass = await bcryptjs.hash(req.body.password, 8); 

      const model = new Model();
      
      // se verifica la autenticidad del token
      jwt.verify(token, process.env.JWT_RECOVERY, (err, dataUser) =>{
         if (err){
            res.status(500).json({valid: false});
            console.log("error de auth : "+ err);
            return;
         }

         // si los email no coinciden
         if (dataUser.payload.email != email){
            res.status(401).json({valid: false});
            return;
         }

         // si es correcto el token se hace el query para cambiar la clave
         model.searchEMail(email, (err, data) => {
            if (err){
               res.status(500).json({change: false});
               console.log("hubo un error en el cambio ", err);
               return;
            }

            if (data.length === 0){
               res.status(401).json({change: false});
               console.log("no se encontró el usuario");
               return;
            }

            // en caso de que el email si exista
            model.changePassword({email,pass}, (err, data) =>{
                  if (err){
                     res.status(500).json({change: false});
                     console.log("no se hizo la consulta: ", err);
                     return;
                  }

                  res.status(201).json({change: true});
                  console.log("se cambio la password");
            });
         });
      });
   }
}

module.exports = ControllerLogin;