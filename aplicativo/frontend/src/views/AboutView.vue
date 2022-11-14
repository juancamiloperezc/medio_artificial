<template> 
  <div id= "background" class="max-tamV">
    <!--  banner de la sección del login -->
    <div v-if="!isAuth">
       <banner-login-vue :selected="3"></banner-login-vue>
    </div>
    <div v-else>
      <nav-bar-dashboard/>
    </div>

    <v-container>
      <presentation></presentation>
    </v-container>

    <!-- sección de los integrantes -->
    <div v-if="!isMobile">
    <v-container >
      <h1 class="mx-auto"> INTEGRANTES: </h1>
      <v-divider></v-divider>
      <v-container fluid class="ma-1 mb-1">
          <div id="div-Hor"> 
            <div  v-for = "(integrant, index) in integrants"
                  :key = "index" 
                  v-bind:key="index"
            >  
              <card-integrant :info="integrant">
              </card-integrant>  
            </div >
          </div >   
        </v-container>
      </v-container>    
    </div>  

    <div v-else>
      <v-container>
        <v-carousel id="background" v-model="model">
          <h1 class="mx-auto"> INTEGRANTES: </h1>
          <v-divider></v-divider>
          <v-divider></v-divider>
          <v-carousel-item
            v-for = "(integrant, i) of integrants"
            :key="i"
          >
            <v-sheet id="background"
              height="100%"
              tile
            >
            <card-integrant :info="integrant">
            </card-integrant>  
            </v-sheet>
        </v-carousel-item>
       </v-carousel>
      </v-container>  
    </div>  
  </div>  
 </template> 
 
 <script> 
  import { mapState } from 'vuex'
  import BannerLoginVue from '@/components/BannerLogin.vue'
  import CardIntegrant  from '@/components/CardIntegrant.vue'
  import Presentation  from '@/components/Presentation.vue'
  import NavBarDashboard from '@/components/NavBarDashboard.vue'

  export default{
    name:'about',
    components: {
      BannerLoginVue, 
      CardIntegrant,
      Presentation,
      NavBarDashboard
    },

    data: () => {
      return{
        isMobile: false,
        model: 0,
        integrants: [
          {
            name: "Laura Nataly Ortiz Cruz", 
            email: "lnortizc@uqvirtual.edu.co",
            src: require("../assets/images/int_lnoc.jpg")
          },

          {
            name: "Carlos Mario Avendaño Quintero",
            email: "carlosm.avendanoq@uqvirtual.edu.co",
            src: require("../assets/images/int_cmaq.jpg")
          },
          
          {
            name: "Juan Camilo Pérez Cadavid", 
            email: "jcperezc_@uqvirtual.edu.co",
            src: require("../assets/images/int_jcpc.jpg")
          }
        ],
      };
    },

    computed: {
      ...mapState(['isAuth']),
    },
 
    methods: {
      // método para actualizar el dato de redimensionamiento de la pantalla 
      resizeWindow(event){
        // se revisa el tamaño de redimensionamiento
        this.isMobile = screen.width < 1200;
      },
    },

    created(){
          // se añade el evento para llamar al callback de redimensionamiento de la pantalla
          window.addEventListener('resize', this.resizeWindow);
          this.isMobile = screen.width < 1200;
    },

    destroyed(){
            window.removeEventListener('resize', this.resizeWindow);
    } 
 
  };
 
 </script>

 <style scoped>
  .max-tamV{
     height: 100%;
  }

  #background{
    background: rgb(180, 250, 180);
  }

  #div-Hor{
    display: flex;
    justify-content: space-around;
  }

  h1{
    color: black;
    text-shadow: 2px 2px 0px rgba(0,0,0,0.15), 2px 2px 0px rgba(0,0,0,0.15);
  }

 </style> 