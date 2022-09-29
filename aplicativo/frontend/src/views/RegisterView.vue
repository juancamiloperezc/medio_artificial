<template>
  <div class="max-tamV">
    <v-container>

      <!--  sección del formulario de registro -->
      <form-login-vue></form-login-vue>
    
    
    </v-container>
  </div>
</template>

<script>
  import FormLoginVue from '@/components/FormLogin.vue';

  export default {
    name: 'Register',

    components: {
        FormLoginVue,
    },

    methods: {
       
    }
  }
</script>

<style scoped>
  .max-tamV{
     height: 100%;
  }
</style>
