<template>
  <div>
     <nav-bar-dashboard/>
     PRINCIPAL 
  </div>
</template>

<script>
  import axios from 'axios' 
  import NavBarDashboard from '@/components/NavBarDashboard.vue'

 export default{
    name: 'home', 
    components: {NavBarDashboard, },

    data: () => {
       return{

       }; 
    },

    methods: {
       
    },
    
 }
</script>

<style scoped>

</style>
