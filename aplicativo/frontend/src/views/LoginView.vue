<template> 
 <div id= "background" class="max-tamV">
   <!--  banner de la sección del login --> 
   <banner-login-vue :selected="1"></banner-login-vue>

   <v-progress-linear v-if="isProgress" :indeterminate="true"></v-progress-linear>

   <!--seccion de la alerta -->
   <v-alert
        transition="scale-transition"
        icon="mdi-alert-circle"
        dismissible
        :value= "isShowAlert"
        :color="colorAlert"
        @click= "alertCall"
      > 
      <div v-if = "colorAlert == 'error'" > 
          No se pudo iniciar sesión
      </div>

      <div v-else-if="colorAlert == 'warning'"> 
         Usuario y/o contraseña incorrectas
      </div>
      
      <div v-else-if="colorAlert == 'success'">
          iniciando sesión
      </div>
    </v-alert>

    <!--  sección del formulario de inicio de sesión -->
    <v-container>
      <form-login-vue ref="form" @loginUser="loginUser">
      </form-login-vue>
    </v-container>

 </div>
</template> 

<script> 

import axios from 'axios'
 import BannerLoginVue from '@/components/ComponentsLogin/BannerLogin.vue'
 import FormLoginVue   from  '@/components/ComponentsLogin/FormLogin.vue'
 
 export default{
   name:'login',
   components: {
    BannerLoginVue,
    FormLoginVue
  },

   data: () => {
     return{
       isShowAlert: false, 
       colorAlert: "success",
       urlAPI: `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/forgotPassword`,
       isProgress: false
     };
   },

   methods: {

     async loginUser(data){ // método para realizar el inicio de sesión de un usuario
      this.isProgress = true;

      try{  
        let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/login`
        
        // se hace la petición para  realizar el inicio de sesión
          let res = await axios.post(url,data);

          this.colorAlert = "success";
          this.isShowAlert = true;

          // se actualizan los  datos del inicio de sesión
          // se guarda el token y el email
         localStorage.setItem("email", data.email);
         localStorage.setItem("token", res.data.token);
         
         this.isProgress = false;

          // en caso de registro exitoso
          this.$router.push('/');

        }catch(err){ // en caso de error
           // se muestra alerta al usuario
           let status = err.response.status;

          if (status == 401){ 
            let {exist, login}  = err.response.data;

            if (!exist){ // en caso de que el usuario no exista
              this.colorAlert = "warning";
              this.isShowAlert = true;
              this.$refs.form.resetForm();
              this.isProgress = false;
              return;
            }

            if (!login){ // en caso de credenciales erroneas
              this.colorAlert = "warning";
              this.isShowAlert = true;
              this.$refs.form.resetForm();
              this.isProgress = false;
              return;
            }
          }

           this.colorAlert = "error";
           this.$refs.form.resetForm();
           this.colorAlert = "error";
           this.isShowAlert = true;
           this.isProgress = false;
           return;
        }
       },

      alertCall(){
        this.isShowAlert = false;
      }
   },

 };

</script>

<style scoped> 
  .max-tamV{
     height: 100%;
  }

  #background{
    background: rgb(180, 250, 180);
 }
</style>