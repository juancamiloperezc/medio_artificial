<template>
  <div id= "background" class="max-tamV">
    <!--  banner de la sección del login --> 
    <banner-login-vue :selected="2"></banner-login-vue>
    <v-progress-linear v-if="isProgress" :indeterminate="true"></v-progress-linear>

    <!-- sección del dialogo para enviar código -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Verificación</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <p> 
              Se enviará un código de verificación
              a tu correo. 
            </p>

            <v-text-field
              label="Ingresa código de verificación"
              type="number"
              v-model="codeVer"
              required
            ></v-text-field>
          </v-container>  
        </v-card-text>      
        <v-card-actions>    
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            CANCELAR
          </v-btn>
          
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            ACEPTAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> 

    <!--seccion de la alerta -->
    <v-alert
        transition="scale-transition"
        icon="mdi-alert-circle"
        dismissible
        :value= "isShowAlert"
        :color="colorAlert"
        @click= "alertCall()"
      > 
      <div v-if = "colorAlert == 'error'" > 
          No se pudo registrar el usuario 
      </div>

      <div v-else-if="colorAlert == 'warning'"> 
          El usuario ya se encuentra registrado
      </div>
      
      <div v-else-if="colorAlert == 'success'">
          Registro exitoso
      </div>
    </v-alert>

    <!--  sección del formulario de registro -->
    <v-container>
      <form-register-vue  ref="form" @register="register">
      </form-register-vue>
    </v-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import FormRegisterVue from '@/components/ComponentsLogin/FormRegister.vue'
  import BannerLoginVue from '@/components/ComponentsLogin/BannerLogin.vue'

  export default {
    name: 'register',

    components: {
        FormRegisterVue,
        BannerLoginVue,
    },

    data: () =>{
      return {
        isShowAlert: false, 
        colorAlert: "success",
        dialog: false, 
        codeVer: null,
        isProgress: false
      };
    },

    methods: {
       
       // método para registrar un usuario nuevo
       async register(data){
        this.isProgress = true;

        try{  
          let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/register`  
        // se hace la petición para registrar los datos en el servidor
          let res = await axios.post(url, data);

          if (res.data.exist){ // en caso de que el usuario ya exista
            this.colorAlert = "warning";
            this.isShowAlert = true;
            this.$refs.form.resetForm();
            this.isProgress = false;
            return;
          }

          // en caso de registro exitoso
          this.colorAlert = "success";
          this.isShowAlert = true;
          this.isProgress = false;

        }catch(err){ // en caso de error
           // se muestra alerta al usuario
           this.colorAlert = "error";
           this.$refs.form.resetForm();
           this.colorAlert = "error";
           this.isShowAlert = true;
           this.isProgress = false;
           return;
        }
       },

       // método para atender el click de las alertas
       alertCall(){
          this.isShowAlert = false;
          this.$router.push('login');
       }, 
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

</style>
