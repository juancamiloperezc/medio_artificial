const express = require('express')
const Controller =  require('../Controllers/ControllerHome')

class RouterHome{
   constructor(){
     this.controller = new Controller();
     this.router = express.Router();
     this.init();
   }

   init(){
      this.router.post('/searchUser', this.controller.isAuth, this.controller.searchId);
      this.router.post("/searchUserEmail", this.controller.isAuth, this.controller.searchEmail)
      this.router.post('/addPropertie', this.controller.isAuth, this.controller.addNewPropertie);
      this.router.post('/addColino', this.controller.isAuth, this.controller.addColino)
      this.router.post('/consultAllProperties', this.controller.isAuth, this.controller.consultAllProperties);
      this.router.post('/consultPropertie', this.controller.isAuth, this.controller.consultPropertie);
      this.router.post('/consultPropertieMeasureColinos',this.controller.isAuth, this.controller.consultPropertieMeasureColino)
      this.router.post('/consultColinoMeasure', this.controller.consultMeasureColino);
   }
}

module.exports = RouterHome;