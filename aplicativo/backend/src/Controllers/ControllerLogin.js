const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
       console.log(data.length);
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
          console.log(process.env.JWT_SECRET);

          // se añade la sesión del token
          jwt.sign({payload}, process.env.JWT_SECRET , {expiresIn: '3h'}, (err, token) => {
              if (err){
                console.log("no se pudo autenticar el usuario " + err);
                res.status(500).json({exist: true, login: false});
                return;
              }

              res.status(200).json({login: true, token: token})  
          });
       }else { // en caso de credenciales incorrectas
          console.log("credenciales incorrectas");
          res.status(401).json({login: false});
          return;
       }

    });
  }
}

module.exports = ControllerLogin;