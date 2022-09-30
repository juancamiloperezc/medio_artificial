<template> 
  <div>
    <!--  banner de la sección del login --> 
    <banner-login-vue :selected="3"></banner-login-vue>
  </div>
 </template> 
 
 <script> 
  import BannerLoginVue from '@/components/BannerLogin.vue'

  export default{
    name:'about',
    components: {BannerLoginVue},
    data: () => {
      return{
 
      };
    },
 
    methods: {
 
    },
 
  };
 
 </script>
