<template>
  <div>
  
   <!-- sección del navbar principal -->
   <v-app-bar  color="red" dark app  id = "background-nav-bar">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
     <v-toolbar-title id = "font-title-bar-1" class="text-uppercase ">
         <span class="font-weight-light">MEDIO ARTIFICIAL APP </span>
     </v-toolbar-title>
     <v-spacer></v-spacer>
     
     <!-- sección del botón para cerrar sesión -->
     <div v-if ="isMobile">
       <v-btn 
         fab
         small
         @click="logout"
       >
         <v-icon >
            mdi-logout
         </v-icon>
       </v-btn>
     </div>  
     <div v-else>
      <v-btn text id = "font-options-drawer-1" @click = "logout">
           <span>CERRAR SESIÓN</span>
           <v-icon mdi-eye></v-icon>
      </v-btn>
    </div> 
   </v-app-bar>

   <!-- sección del navigation drawer lateral-->
   <v-navigation-drawer id = "background-nav-drawer" v-model="drawer" dark app >
    <v-layout column align-center>
         <v-flex id = "font-info-navigation-1" class="mt-5"> 
           <p>   
            <v-avatar size="200">
                <img src="@/assets/images/medio_artificial_logo_2.png" alt="">
            </v-avatar>
            <p class="white--text subheading mt-1 text-center">
                {{logedUser.names}} <br/>
                {{logedUser.lastNames}}
            </p>
            <p  class="white--text subheading mt-1 text-center">
                {{rol[logedUser.rol - 1]}}
            </p>
          </p>  
         </v-flex>
         <v-flex class="mt-4 mb-4">
         </v-flex>
    </v-layout>
    <v-list flat>
      <v-list-item id = "font-options-drawer-1" v-for="link in links" :key="link.text" router :to="link.route" active-class="border">
          <v-list-item-action>
              <v-icon >{{link.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content >
              <v-list-item-title >{{link.text}}</v-list-item-title>
          </v-list-item-content>
      </v-list-item>
    </v-list>
   </v-navigation-drawer>
  </div> 
 </template>

 <script>
   import { mapGetters } from 'vuex'

   export default{
     name: 'NavBarDashboard',
     components: {},
     data: () => {
       return{
          drawer: false,
          links :[
            {icon: 'mdi-home-city', text:'Principal', route: '/'},
            {icon: 'mdi-account-cog', text:'Configuración', route: '/settings'},
            {icon: 'mdi-information', text:'Acerca de', route: '/about'},
          ],
          rol: ['Dueño', 'Ingeniero', 'Agricultor'],
          isMobile : false,
       };
     },

     methods:{
        // método para actualizar el dato de redimensionamiento de la pantalla 
        resizeWindow(event){
          // se revisa el tamaño de redimensionamiento
          this.isMobile = screen.width < 800;
        },

        // método para terminar la sesión actual
        logout(){
           // se reinician los token guardados anteriormente
           localStorage.removeItem('email');
           localStorage.removeItem('token');

           // se redirige al login
           this.$router.push('login');
        }
     },

     computed: {
        ...mapGetters([
            'logedUser'
        ]),
     },

     created(){
          // se añade el evento para llamar al callback de redimensionamiento de la pantalla
          window.addEventListener('resize', this.resizeWindow);
          this.isMobile = screen.width < 800;
      },

      destroyed(){
            window.removeEventListener('resize', this.resizeWindow);
      } 

   }
 </script>

 <style scoped>
  #background-nav-bar{
    background: rgb(146,217,4);
    background: linear-gradient(196deg, rgba(146,217,4,0.8) 0%, rgba(0,80,0,1) 22%, rgba(0,80,0,1) 75%, rgba(149,200,47,1) 95%);
  }

   #font-title-bar-1{
    font-family: Impact;
  }

  #background-nav-drawer{
    background: #005000;
  }

  #font-info-navigation-1{
    font-family: Impact;
  }

  #font-options-drawer-1{
    font-family: Impact;
  }
 </style> 