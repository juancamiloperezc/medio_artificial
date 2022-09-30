<template>
 <div>
  <v-card>
    <v-banner id="background-banner"
      p-5
      single-line
      dark
    > 
      
     <!-- sección del logo del proyecto -->
      <v-card-title id="background-title" class="display-1 ml-5">  
        MEDIO ARTIFICIAL APP
      </v-card-title>    

      <v-card-actions>
        <!-- sección para la definición del banner o el menu -->
          <!--en caso de visualizarse en un dispositivo pequeño-->  
          <div v-if="isMobile">
            <v-btn
              fab
              small
              :class="['mx-2' ,'ma-5',
                        selected == 1? 'background-action-active' : 'background-actions'
                      ]"
              @click = "redirect(1)"
            >
              <v-icon >
                mdi-account-key
              </v-icon>
            </v-btn>

            <v-btn
              class="mx-2"
              fab
              small
              :class="['mx-2','ma-5',
                        selected == 2? 'background-action-active' : 'background-actions'
                      ]"
              @click = "redirect(2)"
            >
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
            </v-btn>

            <v-btn
              fab
              small
              :class="['mx-2','ma-5',
                        selected == 3? 'background-action-active' : 'background-actions'
                      ]"
              @click = "redirect(3)"
            >
              <v-icon>
                mdi-information
              </v-icon>
            </v-btn>

          </div>

          <!-- en caso de visualizarse en un mas grande como pc -->
          <div v-else>
            <v-btn 
              text
              :class="['ma-1',
                        selected == 1? 'background-action-active' : 'background-actions'
                      ]"
              @click = "redirect(1)"        

            >
             INICIAR SESIÓN 
            </v-btn>

            <v-btn MEDIO ARTIFICIAL APP
              text
              :class="['ma-1',
                        selected == 2? 'background-action-active' : 'background-actions'
                      ]"
              @click = "redirect(2)"        

            >
              REGISTRARSE 
            </v-btn>

            <v-btn 
              text
              :class="['ma-1',
                        selected == 3? 'background-action-active' : 'background-actions'
                      ]"
              @click = "redirect(3)"        

            >
             ACERCA DE 
            </v-btn>
          </div>

      </v-card-actions>  
    </v-banner>
  </v-card>
 </div>
</template>

<script>
  
  export default{
      name: "BannerLogin", 
      components: {},

      props: {
        selected: Number,
      },

      data: () => {
        return {
          isMobile: false,
        };
      },

      methods: {
        // método para actualizar el dato de redimensionamiento de la pantalla 
        resizeWindow(event){
          // se revisa el tamaño de redimensionamiento
          this.isMobile = screen.width < 800;
        },

        // método para redireccionar a la ruta elegida
        redirect(id_route){
          if (id_route != this.selected){
            if (id_route == 1) this.$router.push('login');
            else if (id_route == 2) this.$router.push('register');
            else this.$router.push('about');
          }
        }
      },

      created(){
          // se añade el evento para llamar al callback de redimensionamiento de la pantalla
          window.addEventListener('resize', this.resizeWindow);
          this.isMobile = screen.width < 800;
      },

      destroyed(){
            window.removeEventListener('resize', this.resizeWindow);
      } 
  };

</script>

<style scoped>
  #background-banner{
    background: rgb(60,194,60);
    background: linear-gradient(45deg, rgba(60,194,60,1) 0%, rgba(63,194,60,1) 68%, 
                                        rgba(149,200,47,1) 97%, rgba(146,217,4,1) 100%);
  }

  #background-title{
    color: white;
    text-shadow: 2px 2px 0px #000000, 5px 4px 0px rgba(0,0,0,0.15);
    font: bold 90% monospace;
  }

  .background-actions{
     color: white;
     background: rgb(60,194,60);
  }

  .background-action-active{
     color: rgb(60,194,60);
     background: white;
  }

  .background-actions:hover{
    background: white;
    color: rgb(60,194,60);
    transition: 0.5s ease-in-out;
  }

</style>