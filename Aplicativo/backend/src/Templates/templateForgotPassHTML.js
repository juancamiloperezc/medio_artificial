
// se realiza una plantilla para el email a enviar para recuperación de la contraseña
module.exports = templateForgotPassHTML = (data) => {
   return(
    `
         <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">

       <style>
         h1{
           color: white;
           text-shadow: 2px 2px 0px #000000, 5px 4px 0px rgba(0,0,0,0.15);
           font: bold  monospace;
         }

         p{
           text-align: justify;
         }

         #background{
           background: rgb(146,217,4);
           background: linear-gradient(196deg, rgba(146,217,4,0.8) 0%, rgba(60,194,60,0.8) 22%, 
                     rgba(80,195,57,0.8) 75%, rgba(149,200,47,0.8) 95%);
           color: black;
           font-weight: bold;
           text-shadow: 2px 2px 0px rgb(107, 255, 137);
         }

         #background-btn{
           background: #00000031 ;
           font: bold 90% monospace;
           border: 0;
           border-radius: 5px;
           color: white;
         }

         #background-btn:hover{
           cursor: pointer;
           color: white;
           background-color: black;
           transition: ease-in-out 1s;
         }

         .btn{
             width: 50%;
             height: 30px;
         }
         
         .centerDiv{
             justify-items: center;
             text-align: center;
             width: 500px;
             margin: 2%;
             padding: 1%;
             border-radius: 10px;
         }
         
         
       </style>
     </head>
     <body>
        <div id = "background" class="centerDiv">
           <h1> MEDIO ARTIFICIAL APP</h1>
           <p>
               Hola, ${data.names} ${data.lastnames}, nos comunicamos
               desde MEDIO ARTIFICIAL porque recibimos la petición
               de cambiar la contraseña de tu cuenta, por favor 
               presiona el botón para redirigirte al cambio de tu
               clave.
           </p>

           <a href=${data.link}>
            <input class="btn" id = "background-btn" type="button" value="Recupera Clave">
           </a>
        </div>
     </body>
     </html>
    `)
};