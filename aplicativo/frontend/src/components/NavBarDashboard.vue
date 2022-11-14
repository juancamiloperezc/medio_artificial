<template>
  <div>
  
   <!-- sección del navbar principal -->
   <v-app-bar  color="red" dark app >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
     <v-toolbar-title class="text-uppercase ">
         <span class="font-weight-light">INICIO</span>
     </v-toolbar-title>
     <v-spacer></v-spacer>
     <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          text
          v-on="on"
        >
          <v-icon mdi-eye></v-icon>
            <span>Menu</span>
        </v-btn>
      </template>
      <v-list flat>
        <v-list-item v-for="link in links"  :key="link.text" router :to="link.route" active-class="border">
          <v-list-item-title >{{link.text}}</v-list-item-title>
        </v-list-item>
      </v-list>
     </v-menu>
     <v-btn text>
         <span>Exit</span>
         <v-icon mdi-eye></v-icon>
     </v-btn>
   </v-app-bar>

   <!-- sección del navigation drawer lateral-->
   <v-navigation-drawer  v-model="drawer" dark app class="red darken-4">
    <v-layout column align-center>
         <v-flex class="mt-5"> 
              <v-avatar size="100">
                <img src="@/assets/images/medio_artificial_logo_2.png" alt="">
              </v-avatar>
              <p class="white--text subheading mt-1 text-center">Username</p>
         </v-flex>
         <v-flex class="mt-4 mb-4">
         </v-flex>
    </v-layout>
    <v-list flat>
        <v-list-item v-for="link in links"  :key="link.text" router :to="link.route" active-class="border">
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
   export default{
     name: 'NavBarDashboard',
     components: {},
     data: () => {
       return{
          drawer: false,
          links :[
          {icon: 'mdi-eye', text:'Dashboard', route: '/'},
          {icon: 'mdi-eye', text:'My Project', route: '/'},
          {icon: 'mdi-eye', text:'Team', route: '/'}
      ]
       };
     },

     methods:{

     },
   }
 </script>

 <style scoped>

 </style>