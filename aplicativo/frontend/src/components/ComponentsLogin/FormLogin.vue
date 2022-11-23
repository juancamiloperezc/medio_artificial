<template>
  <div>
   <!-- seccion de alerta de recuperación de contraseña -->
   <v-alert
        transition="scale-transition"
        icon="mdi-alert-circle"
        dismissible
        :value= "isShowAlert"
        color="success"
        @click = "() => isShowAlert = false"
      > 
      Se enviará el email solicitado si el correo es valido
    </v-alert>

   <v-container>
    <!-- sección del formulario de recuperación de contraseña-->
    <v-container>
      <v-dialog
        v-model = "dialog"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title id = "background-forgot-password-head">
            <span> Recuperar Contraseña</span>
          </v-card-title>
          <v-card-text id = "background-forgot-password-body">
            <v-container>
              <v-text-field
                autocomplete="on"
                prepend-icon="mdi-email"
                v-model = "email_recovery"
                type="email"
                label = "Correo Electrónico"
                outlined
                required
                :rules="emailRules"
              >
              </v-text-field>
              <v-spacer></v-spacer>
                <v-btn
                    color="green"
                    text
                    @click="dialog = false"
                    class=" ma-1 button-effect"
                    
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="green"
                    text
                    @click="forgotPassword"
                    class="ma-1 button-effect"
                    
                  >
                  Enviar Email
                </v-btn>
           </v-container>  
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>  

    <!-- sección principal -->
    <v-container fluid fill-height align-center justify-center> 
      <v-card elevation = "24" outline shapped round id="background-form">
        
        <!--  sección del logo -->
        <v-container>
          <v-img id="style-logo"  class = "mx-auto"
            min-width="200px" min-height="200px"
            max-height="250px" max-width="250px" 
            src = '@/assets/images/medio_artificial_logo.png'>
          </v-img>
        </v-container>

        <!--  Sección del formulario -->
        <v-container>
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
              v-on:keyup.enter="validateForm"
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
             v-on:keyup.enter="validateForm"
            >
           </v-text-field>

           <!-- sección para recuperación de contraseña -->
           <v-btn text id = "background-btn-forgot" class = "text-sm-body-2"
              @click = "() => dialog = true">
             Recuperar contraseña
           </v-btn>

           <v-container>
            <v-btn 
              id="background-btn-login"
              block
              v-on:keyup.enter ="validateForm"
              @click="validateForm"
              alt = "inicio sesión"
            >
                INICIAR SESIÓN
            </v-btn>
           </v-container>
         </v-form>
        </v-container>
      </v-card>
     </v-container>
   </v-container>
  </div>
</template>

<script>
  import axios from 'axios'

  export default{
    name: 'FormLogin', 
    components: {
      
    },

    data: () => {
       return{
          email: '',
          password: '', 
          isShowPass: false,
          dialog: false,
          isShowAlert: false,
          email_recovery : '',
          
          emailRules: [
             v => !!v || 'El Correo Electrónico es obligatorio',
             v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Ingrese Correo Electrónico válido',
          ],

          passwordRules: [
             v => !!v || 'La Contraseña es obligatoria'
          ],

          emailRulesRec: [
             v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Ingrese Correo Electrónico válido',
          ],
       }
    },

    methods: {
      // método para  validar el formulario
        validateForm(){
          
          if(this.$refs.form.validate()){ 
            // si los datos ingresados son validos 
            let dataUser ={
                 email: this.email, 
                 password: this.password,
              };

              this.$emit("loginUser", dataUser);
           }
        },

        // método para devolver el valor de la contraseña
        resetForm(){
          this.password = "";
        },

        // método para recuperar la contraseña
        async forgotPassword(){
            this.isShowAlert = true;
            this.dialog = false;
            let email = this.email_recovery;

             // se realiza la petición para el envío del email
             let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/forgotPassword`; 
             let urlrecovery = `${process.env.VUE_APP_URL}:${process.env.VUE_APP_PORT}/forgotPassword`; 
            
             try{
                 let data = {email: email};
                 let config = {headers:{'url': urlrecovery}}
                 let res = await axios.post(url, data, config); 
                
             }catch (err){
                  return;
             }
        },
    }
  };
</script>

<style scoped>
  #style-logo{
    height: auto;
    width: auto;
    object-fit: contain;
    align-content: center;
    border-radius: 50%;

  }

  #background-form{
    background: #cbffcb;
  }

  #background-btn-login{
    background:rgba(66,194,60,1);
    color:white;
  }

  #background-btn-login:hover{
    color: white;
    background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
    transition: 0.5s ease-in-out;
  }

  #background-btn-forgot{
    background: #cbffcb;
    color: #5e6fff;
    font: bold 90% monospace;
    text-decoration: underline; 
  }
 
  #background-forgot-password-head{
    color: white;
    font: bold 90% monospace;
    background: rgb(60,194,60);
    background: linear-gradient(45deg, rgba(60,194,60,1) 0%, rgba(63,194,60,1) 68%, 
                                        rgba(149,200,47,1) 97%, rgba(146,217,4,1) 100%);
  }

  #background-forgot-password-body{
    background: #cbffcb;
  }

  .button-effect{
     color: white !important;
     background: rgb(60,194,60);
  }

  .button-effect:hover{
    background: white;
    color: rgb(60,194,60) !important;
    transition: 0.5s ease-in-out;
  }
</style>