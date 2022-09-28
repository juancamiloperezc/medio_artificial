const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')

const RouterLogin = require('./Router/RoutesLogin')

// servidor
class Server{
   constructor(){
    // se configura la raíz para las variables de entorno
    dotenv.config({path: __dirname + "/env/.env"});

    this.app = express();
       
    this.config();
    this.setMiddlewares();
    this.setRoutes();
    this.run();
   }
   
   config(){
    this.app.set('port', process.env.PORT); // se configura el puerto 
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
      const routerLogin = new RouterLogin();

      this.app.use(routerLogin.router);
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
} 

const server = new Server();