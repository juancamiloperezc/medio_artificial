<template> 
 <div id= "background" class="max-tamV">
   <!--  banner de la sección del login --> 
   <banner-login-vue :selected="1"></banner-login-vue>

    <!--  sección del formulario de inicio de sesión -->
    <v-container>
      <form-login-vue>
      </form-login-vue>
    </v-container>

 </div>
</template> 

<script> 
 import BannerLoginVue from '@/components/BannerLogin.vue'
 import FormLoginVue   from  '@/components/FormLogin.vue'

 export default{
   name:'login',
   components: {
    BannerLoginVue,
    FormLoginVue
  },

   data: () => {
     return{

     };
   },

   methods: {

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