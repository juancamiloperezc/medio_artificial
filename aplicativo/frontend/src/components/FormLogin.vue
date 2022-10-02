<template>
  <div>
   <v-container>
    <v-container fluid fill-height align-center justify-center> 
      <v-card elevation = "24" outline shapped round id="background-form">
        
        <!--  sección del logo -->
        <v-container>
          <v-img id="style-logo"  class = "mx-auto"
            min-width="200px" min-height="200px"
            max-height="250px" max-width="250px" 
            src="../assets/images/medio_artificial_logo.png">
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

           <v-container>
            <v-btn 
              id="background-btn-login"
              block
              v-on:keyup.enter ="validateForm"
              @click="validateForm"
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
  export default{
    name: 'FormLogin', 
    components: {
      
    },

    data: () => {
       return{
          email: '',
          password: '', 
          isShowPass: false,
          
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
        }
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

</style>