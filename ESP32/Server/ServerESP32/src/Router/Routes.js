const express = require('express');
const Controller = require('../Controllers/ControllerMeditions');

// rutas para las peticiones del servidor
class RoutesMeditions{
   constructor(){
     this.controller = new Controller();
     this.router = express.Router();
     this.config();
   }

   config(){
       this.router.get('/search', this.controller.searchForPosition);
       this.router.post('/saveTemp', this.controller.saveNewTemp);
       this.router.post('/saveHum', this.controller.saveNewHum);
   }
}

module.exports = RoutesMeditions;