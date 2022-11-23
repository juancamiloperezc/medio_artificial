const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

const RoutesMeditions =  require('./Router/Routes');

// clase del servidor que se encarga de recibir los datos de los sensores
class Server{
   
  constructor(){
   // se configura la ruta de las variables de entorno
   dotenv.config({path: __dirname + '/env/.env'}); 
    
   this.app = express();
     
   this.config();
   this.setMiddlewares();
   this.setRoutes();
   this.run();
  }

  config(){
     // se define el puerto de escucha del servidor
     this.app.set('port', process.env.PORT || 3001);
  }
  
  setMiddlewares(){
      this.app.use(cors()); // permite las peticiones ajax
      this.app.use(express.json()); // permite identificar json entrantes
      this.app.use(morgan('tiny'));
      this.app.use(express.urlencoded({extended: false}));

      this.app.use(cors({
        origin: "*",
        methods: ['GET', 'POST', 'DELETE', 'PUT']
      }));
  }

  setRoutes(){
      const routes = new RoutesMeditions();

      this.app.use(routes.router);
  }

  run(){
    // se configura la ruta raíz
    this.app.get('/', (req, res) => {
       res.status(200).json({msg: "servidor corriendo en http://localhost:" + this.app.get('port')});
    });

    // se corre el servidor
    this.app.listen(this.app.get('port'), () => {
     console.log("servidor corriendo en http://localhost:" + this.app.get('port')); 
    });
  }

};

const server = new Server();

const mysql = require('mysql')

const connection = () => {
  const conn = mysql.createConnection({
    host:  "127.0.0.1",
    user:  "root", 
    port: 3306,
    database: "medio_artificial" 
  });

  return conn;
}
