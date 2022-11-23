<template>
  <div class="max-height-page">
   <!--seccion de la alerta -->
   <v-alert
         transition="scale-transition"
         icon="mdi-alert-circle"
         dismissible
         :value= "isShowAlert"
         :color="colorAlert"
      > 
         <div v-if = "colorAlert == 'error'" > 
               No se pudo registrar el colino
         </div>
         
         <div v-else-if="colorAlert == 'success'">
               se registró correctamente el colino
         </div>
   </v-alert>
   <v-container>
      <v-dialog
        v-model = "dialog"
        persistent
        max-width="600px"
      >
        <v-card>
         <v-app-bar id = "background-head-form">
            <v-card-title >
               <span> Añadir nuevo colino</span>
            </v-card-title>
         </v-app-bar>      
          <v-card-text>
            <v-container>
             <v-form ref="form"> 
               <v-text-field
                autocomplete="on"
                prepend-icon="mdi-home"
                v-model = "id_property"
                label = "id finca"
                outlined
                required
                :rules="digitRules"
              >
              </v-text-field>
              
              <v-text-field
                autocomplete="on"
                prepend-icon="mdi-sign-direction"
                v-model = "position"
                label = "Posición"
                outlined
                required
                :rules="digitRules"
              >
              </v-text-field>

              <v-text-field
                autocomplete="on"
                prepend-icon="mdi-email"
                v-model = "fecha_ingreso"
                type="email"
                label = "Fecha Ingreso"
                outlined
                required
                :rules="dateRules"
              >
              </v-text-field>

              <v-text-field
                autocomplete="on"
                prepend-icon="mdi-email"
                v-model = "tam_inicial"
                type="email"
                label = "Tamaño inicial (cm)"
                outlined
                required
                :rules="digitRules"
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
                    @click="addColino"
                    class="ma-1 button-effect"
                  >
                  AÑADIR
                </v-btn>
               </v-form> 
           </v-container>  
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-card v-if="dataComplete">
         <v-app-bar class="background-nav">
            <v-card-title> 
              <b> FINCA </b>: {{dataProperty.dataProperty.nombre}}
            </v-card-title>

            <v-divider></v-divider>

            <v-btn v-if="logedUser.rol == 3"
               @click="dialog=true"  
             >
               <v-icon>mdi-sticker-plus-outline</v-icon>
            </v-btn> 
         </v-app-bar>   

         <v-card-subtitle>
               <p> <b> ID </b> : {{dataProperty.dataProperty.id}} </p>
               <p> <b> DIRECCIÓN </b> : {{dataProperty.dataProperty.direccion}} </p>
               <p> <b> EMAIL JEFE </b> : {{dataProperty.dataProperty.email_jefe}} </p>
               <p> <b> EMAIL INGENIERO </b> : {{dataProperty.dataProperty.email_ingeniero}} </p>
               <p> <b> EMAIL AGRICULTOR </b> : {{dataProperty.dataProperty.email_agricultor}} </p>
         </v-card-subtitle>   

         <v-data-table
            :headers="headers"
            :items="dessert"
            :items-per-page="5"
            @click:row="handleClick"
         >
         <template v-slot:item.colino_activo="{ item }">
            <v-chip
            :color="getColorOfTableProperty(item.colino_activo)"
            dark
            >
            {{ item.colino_activo }}
            </v-chip>
         </template>
         
         </v-data-table>

         <v-container fluid fill-height justify-center>
            <v-progress-circular  v-if="isProgressData" 
               indeterminate
               color="primary"
            ></v-progress-circular>
         </v-container>   
         
         <v-container>
            <v-card class = " success mt-5 text-align-center" >
            <div> 
               <v-card-title> DATOS DE COLINO SELECCIONADO  </v-card-title> 
               <v-progress-linear v-if="isProgress" :indeterminate="true"></v-progress-linear>   
            </div>

            <v-data-table 
                  :headers="headersMeasure"
                  :items="dessertsMeasure"
                  :items-per-page="5">
                  
                  <template v-slot:item.medicion_temperatura="{ item }">
                     <v-chip
                     :color="getColorTableColinos(item.medicion_temperatura, 'temp')"
                     dark
                     >
                     {{ item.medicion_temperatura}}
                     </v-chip>
                  </template>

                  <template v-slot:item.medicion_humedad="{ item }">
                     <v-chip
                     :color="getColorTableColinos(item.medicion_humedad, 'hum')"
                     dark
                     >
                     {{ item.medicion_humedad }}
                     </v-chip>
                  </template>
                  
               </v-data-table>
            </v-card>
         </v-container>   
      </v-card>
   </v-container>

  </div>
</template>

<script>
import DataTable from '@/components/ComponentsDashboard/DataTable.vue'
import axios from 'axios'
import { mapGetters, mapState } from 'vuex';


export default {

   name: "DataPresentation",
   components:{DataTable},
   data: () =>{
      return {
          dataComplete: false,
          dataProperty: [],
          headers: [
                  {text: 'id', value: 'id'},
                  {text: 'posicion', value: 'posicion' },
                  {text: 'Fecha Ingreso', value: 'fecha_ingreso' },
                  {text: 'Fecha salida', value: 'fecha_salida' },
                  {text: 'Tamaño inicial', value: 'tam_inicial' },
                  {text: 'Colino activo', value: 'colino_activo' },
                  {text: 'Tipo retiro', value: 'tipo_retiro' }
          ],

          dessert: [],

          headersMeasure: [
            {text: 'id', value: 'id'},
            {text: 'id colino', value: 'id_colino'},
            {text: 'Fecha medicion', value: 'fecha_medicion'},
            {text: 'Hora medicion', value: 'hora_medicion'},
            {text: 'Medicion temperatura', value: 'medicion_temperatura'},
            {text: 'Medicion humedad', value: 'medicion_humedad'},
          ],
          
          emailRules: [
             v => !!v || 'El Correo Electrónico es obligatorio',
             v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Ingrese Correo Electrónico válido',
          ],

          nameRules:[
            v => !!v || 'Este campo es obligatorio' ,
            v => /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(v) || "Ingrese valor valido",
            v => v.length <= 50 || "máximo 50 caracteres"
          ],

          digitRules:[
            v => /^\d+$/.test(v) || 'Ingrese un id númerico',
            v => !!v || 'Ingrese un id valido'
          ],

          dateRules:[
            v => /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(v) || 'yyyy-mm-dd',
            v => !!v || 'ingrese una fecha valida'
          ],

          dessertsMeasure: [],
          isProgress: false, 
          isProgressData: false,
          dialog: false,
          id_property: '',
          position: '',
          fecha_ingreso: '',
          tam_inicial: '',
          isShowAlert: false, 
          colorAlert: 'success',
      }
   },

   methods:{
      
      async consulterId(id){
            let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/searchUserEmail`
            let config = {headers: {authorization: localStorage.getItem("token")}};

            try{
               // se consulta por el email y tipo de rol
               let res = await axios.post(url, {id}, config);
               // en caso de que si exista el usuario
               return res.data.data[0].email;
            }catch(err){
               return {exist:false};
            }
      },

      async handleClick(value){
         this.isProgress = true;
         this.isProgressData = true;
         this.dessertsMeasure = [];

         // se consulta los datos del colino por su id
         let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/consultColinoMeasure`
         let config = {headers: {authorization: localStorage.getItem("token")}};
         
         try{
            let res = await axios.post(url, {id: value.id}, config);
            let dataColinos = res.data.data;

            dataColinos.map((obj) =>{
               let fecha_medicion = new Date(obj.fecha_medicion);
               fecha_medicion = `${fecha_medicion.getFullYear()}-${fecha_medicion.getMonth()+1}-${fecha_medicion.getDate()}`;
               
               this.dessertsMeasure.push({
                     id: obj.id,
                     id_colino: obj.id_colino,
                     fecha_medicion: fecha_medicion,
                     hora_medicion: obj.hora_medicion,
                     medicion_temperatura: obj.medicion_temp,
                     medicion_humedad: obj.medicion_hum
               });
            });
            
         }catch(err){
            console.log(err);     
         }

         this.isProgress = false;
         this.isProgressData = false;
      },

      getColorOfTableProperty(data){
         if (data == "si") return 'success';
         else return 'error'
      }, 

      getColorTableColinos(data, type){
         if (type == 'temp'){
            if (data > 30){
               return 'error'
            }else if (data < 20){
               return 'error'
            }else{
               return 'success'
            }
         }else {
            if (data > 65){
               return 'error'
            }else if (data < 30){
               return 'error'
            }else{
               return 'success'
            }
         }
      }, 

      async addColino(){
         if (this.$refs.form.validate()){
            this.dialog = false;
            console.log("valido")
            // se consulta los datos del colino por su id
            let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/addColino`
            let config = {headers: {authorization: localStorage.getItem("token")}};
            let data = {
                  id: this.id_property,
                  posicion: this.position,
                  fecha_ingreso: this.fecha_ingreso,
                  tam_inicial: this.tam_inicial
            }
         
            try{
               let res = await axios.post(url, data, config);
               console.log(res.data)

               if (res.data.created){ // si el registro es exitoso
                  this.isShowAlert = true;
                  this.colorAlert = 'success'
                  return;
               }

               this.colorAlert = 'error';
               this.isShowAlert = true;
               
            }catch(err){
               this.colorAlert = 'error';
               this.isShowAlert = true;
               console.log(err);
            }
         }
      }
   },

   computed: {
      ...mapGetters(['logedUser']),
   },

   mounted: async function(){
      // se realiza la petición para consultar los datos de la propiedad actual
      let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/consultPropertie`
      let config = {headers: {authorization: localStorage.getItem("token")}};

      try{
         let res = await axios.post(url, {id:this.$route.params.id}, config);
         this.dataProperty.dataProperty = {
            nombre: res.data.data[0].nombre,
            id: res.data.data[0].id,
            direccion: res.data.data[0].direccion,
            email_jefe: await this.consulterId(res.data.data[0].id_jefe),
            email_agricultor: await this.consulterId(res.data.data[0].id_agricultor),
            email_ingeniero: await this.consulterId(res.data.data[0].id_ingeniero)
         };

         // se realiza la consulta de los colinos por el idthis. de la finca
         url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/consultPropertieMeasureColinos`
         res = await axios.post(url, {id: this.$route.params.id}, config);
         this.dataProperty.dataColinos = res.data.data;

         this.dataComplete = true;
         
         this.dataProperty.dataColinos.map((colino) =>{
             let fecha_ingreso = new Date(colino.fecha_ingreso);
             fecha_ingreso = `${fecha_ingreso.getFullYear()}-${fecha_ingreso.getMonth()+1}-${fecha_ingreso.getDate()}`;
             
             let fecha_salida = ""
             
             if (colino.fecha_salida != null){ 
               let fecha_salida = new Date(colino.fecha_salida);
               fecha_salida = `${fecha_salida.getFullYear()}-${fecha_salida.getMonth()+1}-${fecha_salida.getDate()}`;
             }

              this.dessert.push({
                id: colino.id,
                posicion: colino.posicion,
                fecha_ingreso: fecha_ingreso,
                fecha_salida: fecha_salida,
                tam_inicial: colino.tam_inicial,
                colino_activo: (colino.colino_activo == 1)? "si": "no",
                tipo_retiro: (colino.tipo_retiro == null)? " " : colino.tipo_retiro
               })

         });
         
      }catch(err){
         console.log(err)
      }
   },

}
</script>

<style scoped> 
   .max-height-page{
      height: 100%;
      background: rgba(0, 0, 0, 0.328);
   }

   .background-nav{
      background: rgb(81,255,81);
      background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
      color: white;
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

  #background-head-form{
   background: rgb(81,255,81);
   background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
  }

</style>

