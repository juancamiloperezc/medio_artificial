<template>
  <div >
   
      <!--seccion de la alerta -->
      <v-alert
         transition="scale-transition"
         icon="mdi-alert-circle"
         dismissible
         :value= "isShowAlert"
         :color="colorAlert"
      > 
         <div v-if = "colorAlert == 'error'" > 
               No se pudo registrar la propiedad
         </div>
         
         <div v-else-if="colorAlert == 'success'">
               Registro exitoso
         </div>
      </v-alert>

      <v-container 
      justify-center 
      >
      <v-app-bar id="background-nav-form">
         <v-card-title>
            FINCAS   
         </v-card-title>   
          
         <v-spacer> </v-spacer>
         
         <v-btn v-if="logedUser.rol == 1"
              @click="dialog=true"
            
            >
            <v-icon>mdi-sticker-plus-outline</v-icon>
         </v-btn>  
      </v-app-bar>

      <v-card 
         v-scroll.self="onScroll"
         class="overflow-y-auto"
         max-height="600"
         id="background-form"
      >
         <v-container grid-list-md>  
            <v-layout row wrap>
               <v-flex xs12 sm6 md4 v-for="(inf, index) in info" :key="index">
                  <cards-presentation :info="inf" @callback="updateInfoProperties"/>
               </v-flex>
            </v-layout>     
         </v-container>  
      </v-card>   

   <!-- sección del pop up para registrar nueva propiedad en caso de ser jefe -->
   <v-container v-if = "logedUser.rol == 1">
      <v-dialog
        v-model = "dialog"
        persistent
        max-width="600px"
      >
        <v-card>
         <v-app-bar id = "background-head-form">
            <v-card-title >
               <span> Añadir nueva propiedad</span>
            </v-card-title>
         </v-app-bar>      
          <v-card-text>
            <v-container>
             <v-form ref="form"> 
               <v-text-field
                autocomplete="on"
                prepend-icon="mdi-home"
                v-model = "name_property"
                label = "Nombre Propiedad"
                outlined
                required
                :rules="nameRules"
              >
              </v-text-field>
              
              <v-text-field
                autocomplete="on"
                prepend-icon="mdi-sign-direction"
                v-model = "direction_property"
                label = "Dirección Propiedad"
                outlined
                required
                :rules="nameRules"
              >
              </v-text-field>

              <v-text-field
                autocomplete="on"
                prepend-icon="mdi-email"
                v-model = "email_engineering"
                type="email"
                label = "Email Ingeniero"
                outlined
                required
                :rules="emailRules"
              >
              </v-text-field>

              <v-text-field
                autocomplete="on"
                prepend-icon="mdi-email"
                v-model = "email_farmer"
                type="email"
                label = "Email Agricultor"
                outlined
                required
                :rules="emailRules"
              >
              </v-text-field>

              <v-spacer></v-spacer>
                <v-btn
                    color="green"
                    text
                    @click="dialog = false"
                    class="ma-1 button-effect"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="green"
                    text
                    @click="addPropertie"
                    class="ma-1 button-effect"
                  >
                  AÑADIR
                </v-btn>
               </v-form> 
           </v-container>  
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>   
   </v-container>
  </div>  
</template> 

<script>
  import axios from 'axios'
  import store from '@/store'
  import { mapGetters, mapState } from 'vuex';
  import CardsPresentation from  '@/components/ComponentsDashboard/CardsPresentation.vue'

  export default{
     name: 'presentationProperties',
     components: {CardsPresentation},
     data: ()=> {
        return{
           name_property : '',
           direction_property: '',
           email_engineering: '',
           email_farmer: '',
           scrollInvoked: 0,
           dialog: false,
           emailRules: [
             v => !!v || 'El Correo Electrónico es obligatorio',
             v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Ingrese Correo Electrónico válido',
           ],

           nameRules:[
              v => !!v || 'Este campo es obligatorio' ,
              v => /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(v) || "Ingrese valor valido",
              v => v.length <= 50 || "máximo 50 caracteres"
           ],

           info: [], 
           allProperties: [],
           isShowAlert: false,
           colorAlert : 'success'
        }
     },

     methods:{
         updateInfoProperties(id){
            // se recupera los datos de la finca del usuario actual
            store.commit('updateRedirectValid', true);
            this.$router.push(`/dataPresentation/${id}`);
         },

         // método para agregar un nuevo predio en caso de ser el jefe
         async addPropertie(){
           if (this.$refs.form.validate()){    

               if (this.logedUser.rol != 1){
                  this.dialog = false;
                  return;
               }

               // se verifica la existencia del correo del ingeniero
               let res_eng = await this.verifyExistOfEmails(this.email_engineering, 2);
               let res_farmer = await this.verifyExistOfEmails(this.email_farmer, 3);

               if (res_eng.exist && res_farmer.exist){
                   // se hace la petición para crear la nueva propiedad
                   let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/addPropertie`
                   let config = {headers: {authorization: localStorage.getItem("token")}};
                   let data = {
                      nombre: this.name_property, 
                      direccion: this.direction_property,
                      id_jefe: this.logedUser.id, 
                      id_ingeniero: res_eng.id, 
                      id_agricultor: res_farmer.id,
                      email: this.logedUser
                   }

                   try{
                      let res = await axios.post(url,data, config);
                      if (res.data.created){ // en caso de que se haya creado
                         this.dialog = false;
                         this.isShowAlert = true;
                         this.colorAlert = 'success';
                         return;
                      }

                      this.dialog = false;
                      this.isShowAlert = true;
                      this.colorAlert = 'error';

                   }catch(err){ // en caso de que no se haya creado la propiedad
                      this.isShowAlert = true;
                      this.colorAlert = 'error';
                      this.dialog = false;
                   }
               }
            }
         },

         // método para la verificación de la existencia de los email
         async verifyExistOfEmails(email, rol){
            // se hace la petición para agregar un nuevo predio o finca
            let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/searchUser`
            let config = {headers: {authorization: localStorage.getItem("token")}};

            try{
               // se consulta por el email y tipo de rol
               let res = await axios.post(url, {email, rol}, config);
               // en caso de que si exista el usuario
               return res.data;
            }catch(err){
               return {exist:false};
            }
         }, 

         onScroll () {
            this.scrollInvoked++
         },
     },

     computed:{
      ...mapGetters(['logedUser']),
      ...mapState({redirectValid: 'redirectValid'}),
     },

     mounted: async function() {
         store.commit('updateRedirectValid', false);

        // se hace la petición para recuperar todos los datos de las fincas
        let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/consultAllProperties`
        let config = {headers: {authorization: localStorage.getItem("token")}};

        try{
            let res = await axios.post(url, {id:this.logedUser.id}, config);
         
            if (res.data.length == 0){ // se obtiene vacío por defecto
               this.info = [
                  {title: 'Nombre: no disponible', subtitles: ['no información', 'no información'], color: "error"},
               ] 

               return;
            }

            this.allProperties = res.data.data; // se obtiene el arreglo de elementos
            
            // se añaden los elementos
            let infoAux = this.allProperties.map((obj) =>{
                  let new_object = {
                     id: obj.id,
                     title: `Nombre: ${obj.nombre}`,
                     color: "success",
                     subtitles: [
                        `id: ${obj.id}`,
                        `direccion: ${obj.direccion}`,
                     ]
                  };

                  return new_object;
            });
            
            this.info = infoAux;

        }catch(err){
         this.info = [
            {title: 'Nombre: no disponible', subtitles: ['no información', 'no información'], color: "error"},
         ]
        }  
     }
  }
</script>

<style scoped>
   #background{
    background: rgb(180, 250, 180);
  }

  #background-nav-form{
    background: #001aff93;
  }

  #background-nav-form{
   background: rgb(81,255,81);
    background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
   color: white;
   font-family: Impact;
   font-weight: bold;
  }

  #background-head-form{
   background: rgb(81,255,81);
   background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
  }

  .button-effect{
     color: white !important;
     background: rgb(60,194,60);
  }

  .button-effect:hover{
    background: white;
    color: rgb(60,194,60) !important;
    transition: 0.5s ease-in-out;
  }



</style> 