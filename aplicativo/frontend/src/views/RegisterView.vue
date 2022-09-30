<template>
  <div id= "background" class="max-tamV">
    <!--  banner de la sección del login --> 
    <banner-login-vue :selected="2"></banner-login-vue>

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
  import FormRegisterVue from '@/components/FormRegister.vue';
  import BannerLoginVue from '@/components/BannerLogin.vue'

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
      };
    },

    methods: {
       // método para registrar un usuario nuevo
       async register(data){
        try{  
        // se hace la petición para registrar los datos en el servidor
          let res = await axios.post(`${process.env.VUE_APP_URL_API}/register`, data);

          if (res.data.exist){ // en caso de que el usuario ya exista
            this.colorAlert = "warning";
            this.isShowAlert = true;
            this.$refs.form.resetForm();
            return;
          }

          // en caso de registro exitoso
          this.colorAlert = "success";
          this.isShowAlert = true;

        }catch(err){ // en caso de error
           // se muestra alerta al usuario
           this.colorAlert = "error";
           this.$refs.form.resetForm();
           this.colorAlert = "error";
           this.isShowAlert = true;
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
