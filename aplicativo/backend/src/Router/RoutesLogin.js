const express = require('express')
const Controller = require('../Controllers/ControllerLogin')

// clase para el enrutador 
class RouterLogin{
  constructor(){
     // se crea el enrutador con express
     this.controller = new Controller();
     this.router = express.Router();
     this.init();
  }

  init(){
    
    this.router.post('/register', this.controller.register);
    this.router.post('/login', this.controller.login);
    this.router.post('/login/valid', this.controller.isAuth);
  }
}

module.exports = RouterLogin;