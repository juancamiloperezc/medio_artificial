const express = require('express')
const Controller =  require('../Controllers/ControllerHome')

class RouterHome{
   constructor(){
     this.controller = new Controller();
     this.router = express.Router();
     this.init();
   }

   init(){
      this.router.post('/measures', this.controller.isAuth, this.controller.getMeasures);
   }
}

module.exports = RouterHome;