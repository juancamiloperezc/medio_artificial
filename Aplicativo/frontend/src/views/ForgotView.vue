<template>
 <div id = "background" class = "max-tamV">
    <!--seccion de la alerta -->
    <v-alert
        transition="scale-transition"
        icon="mdi-alert-circle"
        dismissible
        :value= "isShowAlert"
        :color="colorAlert"
        @click= "() => isShowAlert = false"
      >  
         <div v-if = "colorAlert == 'error'" > 
                  No se pudo realizar el cambio
         </div>
               
         <div v-else-if="colorAlert == 'success'">
            Registro exitoso
         </div>
      </v-alert>

   <v-container fluid fill-height justify-center>
    <v-card elevation = "24" outline shapped round>  
    

    <!-- sección del titulo -->
     <v-app-bar dark id = "background-title">
      <v-card-title> RECUPERACIÓN DE CONTRASEÑA </v-card-title>
     </v-app-bar>

     <!-- sección para los campos de entrada y las acciones-->
     <v-card-text id = "background-form">    
      <v-form ref = "form" lazy-validation>    
         <v-text-field
            autocomplete="on"
            prepend-icon="mdi-email"
            v-model = "email"
            type="email"
            label = "Correo Electrónico"
            outlined
            required

            :rules = "emailRules"
            v-on:keyup.enter="recoveryPassword"
            >
         </v-text-field>

         <v-text-field
             autocomplete="on"
             prepend-icon="mdi-lock"
             v-model = "password"
             label = "Contraseña"
             outlined
             required
             
             :rules="passwordRules" 
             :append-icon= "isShowPass ? 'mdi-eye' : 'mdi-eye-off'"
             :type= "isShowPass?  'text' : 'password'"

             @click:append= "()=>{isShowPass = ! isShowPass}"
             v-on:keyup.enter="recoveryPassword"
            >
         </v-text-field>

         <v-container>
            <v-btn 
              id="background-btn"
              block
              v-on:keyup.enter ="recoveryPassword"
              @click = "recoveryPassword"
            >
                CAMBIAR CLAVE
            </v-btn>
         </v-container>   
      </v-form>   
      </v-card-text>        
    </v-card>    

   </v-container>           
 </div>
</template>

<script>
import axios from 'axios'

export default{
   name: 'forgotPassword',
   components: {},
   data: () => {
      return{
         email: '',
         password: '',
         emailParam: '',
         tokenParam: '', 
         isShowPass: false,
         isShowAlert: false,
         colorAlert: '',

         emailRules: [
             v => !!v || 'El Correo Electrónico es obligatorio',
             v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Ingrese Correo Electrónico válido',
          ],

          passwordRules: [
             v => !!v || 'La Contraseña es obligatoria'
          ],
      };
   },

   methods: {
      async recoveryPassword(){
         if(this.$refs.form.validate()) {
            if (this.emailParam != this.email){
               console.log("no es valido el email");
               return;
            }
            
            let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/recoveryPassword`; 
            let data = {email:this.email, password:this.password, token:this.tokenParam};

            try {
               // se hace la consulta a la API
               let res = await axios.put(url, data);
               
               if (res.data.change){
                  this.colorAlert = "success";
                  this.isShowAlert = true;
               }else{
                  this.colorAlert = "error";
                  this.isShowAlert = true;
               }
               
               // se reinician los token guardados anteriormente
               localStorage.removeItem('email');
               localStorage.removeItem('token');
              
               // se hace el ruteo al principal
               this.$router.push('/');

               return;
            }catch(err){
               this.colorAlert = "error";
               this.isShowAlert = true;
            }
         }
      }
   },

   mounted(){
       // se hace la petición para verificar el token
       this.emailParam = this.$route.params.email;
       this.tokenParam = this.$route.params.token;

       this.$router.push("forgotPassword")
   }
}

</script>

<style scoped> 
  .max-tamV{
     height: 100%;
  }

  #background{
    background: rgb(180, 250, 180);
  }

  #background-title{
    background: rgb(81,255,81);
    background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
  }

  #background-form{
    background: #cbffcb;
  }

  #background-btn{
    background:rgba(66,194,60,1)
  }

  #background-btn:hover{
    color: white;
    background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
    transition: 0.5s ease-in-out;
  }
</style>