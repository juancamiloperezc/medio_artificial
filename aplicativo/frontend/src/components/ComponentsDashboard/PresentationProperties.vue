<template>
  <div>
    <v-container>
      <v-container 
      fluid 
      justify-center 
      ma-2 
      mb-2
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
         max-height="500"
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
   </v-container>

   <!-- sección del pop up para registrar nueva propiedad en caso de ser jefe -->
   <v-container v-if = "logedUser.rol == 1">
      <v-dialog
        v-model = "dialog"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title id = "background-forgot-password-head">
            <span> Añadir nueva propiedad</span>
          </v-card-title>
          <v-card-text id = "background-forgot-password-body">
            <v-container>
             <v-form ref="form"> 
               <v-text-field
                autocomplete="on"
                prepend-icon="mdi-email"
                v-model = "name_property"
                label = "Nombre Propiedad"
                outlined
                required
              >
              </v-text-field>
              
              <v-text-field
                autocomplete="on"
                prepend-icon="mdi-email"
                v-model = "direction_property"
                label = "Dirección Propiedad"
                outlined
                required
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
                  
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="green"
                    text
                    @click="addPropertie"
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
  import { mapGetters } from 'vuex';
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

           info: [], 
           allProperties: [],
        }
     },

     methods:{
         updateInfoProperties(id){
            // se recupera los datos de la finca del usuario actual
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
               console.log(res_eng);
               
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
                         
                      }

                      this.dialog = false;
                   }catch(err){ // en caso de que no se haya creado la propiedad
                     this.dialog = false;
                      return;
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
     },

     mounted: async function() {
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
   background: rgba(0, 0, 0, 0.554);
   color: white;
   font-family: Impact;
   font-weight: bold;
  }
</style> 