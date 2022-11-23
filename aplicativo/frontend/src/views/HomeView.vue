<template>
  <div class= "max-height-page">
    <nav-bar-dashboard :links="linksMain"/>
    <presentation-properties />
  </div>
</template>

<script>
  import axios from 'axios' 
  import NavBarDashboard from '@/components/ComponentsDashboard/NavBarDashboard.vue'
  import PresentationProperties from '@/components/ComponentsDashboard/PresentationProperties.vue'
  
  import { mapGetters} from 'vuex';

 export default{
    name: 'home', 
    components: {NavBarDashboard, PresentationProperties},

    data: () => {
       return{
         linksMain :[
            {icon: 'mdi-home-city', text:'Principal', route: '/'},
            {icon: 'mdi-account-cog', text:'Configuración', route: '/settings'},
            {icon: 'mdi-information', text:'Acerca de', route: '/about'},
          ]
       }; 
    },

    methods: {
      
    },
    
    computed: {
       ...mapGetters(['logedUser']),
       
    }
 }

</script>

<style scoped>
   .max-height-page{
      height: 100%;
      background: rgba(0, 0, 0, 0.328);
   }
</style>
