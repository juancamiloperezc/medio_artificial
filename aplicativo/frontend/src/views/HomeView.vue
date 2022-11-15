<template>
  <div>
     <nav-bar-dashboard/>
     <v-container fluid fill-height justify-center class = "mt-2">
       <v-container>    
        <v-card class = "mx-auto mb-2">
         <v-app-bar> 
           <v-card-title> TABLA DE MEDICIONES</v-card-title>
         </v-app-bar> 
          <v-card-actions> 
            <v-container>
               <v-row>
                 <v-col>
                  <v-checkbox
                      v-model="selectedFilter"
                      label="ID COLINO"
                      value="id"
                    >
                  </v-checkbox>
                 </v-col>
     
                 <v-col> 
                  <v-text-field autocomplete="on"
                    v-model="id"
                    type="text"
                    label="id"
                    outlined
                    required
                    
                    :rules="numberRules" 
                    v-on:keyup.enter="validateForm"
                    >
                  </v-text-field>
                </v-col> 
               </v-row> 

               <v-row>
                 <v-col>
                  <v-checkbox
                      v-model="selectedFilter"
                      label="FECHA DE MEDICIÓN"
                      value="fecha_medicion"
                    >
                  </v-checkbox>
                 </v-col>
                 <v-col> 
                   <v-text-field autocomplete="on"
                       v-model="date_medition"
                       type="text"
                       label="fecha"
                       outlined
                       required
                       
                       :rules="dateRules" 
                       v-on:keyup.enter="validateForm"
                       >
                     </v-text-field>
                </v-col> 
               </v-row> 

               <v-row>
                <v-col>
                  <v-btn
                    dark
                    block
                    id="btn-filter"
                    @click="addFilter"
                    >
                     AGREGAR FILTRADO 
                  </v-btn>
                </v-col>

                <v-col>
                  <v-btn
                    dark
                    block
                    @click="changeTableVisibility"
                    :color = 'btnTableColor'
                  >
                      {{stringTable}}
                  </v-btn>
                </v-col>  
               </v-row> 

               <!-- sección de la tabla de mediciones --> 
                <v-card
                    class="mx-auto ma-5"
                > 
                  <div v-if = "isTableVisible">
                    <data-table ref = "table" @getCurrentItems = "getCurrentItems" :headers = "headers"/>  
                  </div>
                </v-card>

            </v-container>  
          </v-card-actions>  
        </v-card>
       </v-container>
    </v-container> 
  </div>
</template>

<script>
  import axios from 'axios' 
  import NavBarDashboard from '@/components/NavBarDashboard.vue'
  import DataTable from '@/components/DataTableMain.vue'

 export default{
    name: 'home', 
    components: {NavBarDashboard, DataTable},

    data: () => {
       return{
          headers: [
            {text: 'ID', value: 'id'},
            {text: 'ID COLINO', value: 'id_colino'},
            {text: 'FECHA MEDICIÓN', value: 'fecha_medicion'},
            {text: 'HORA MEDICIÓN', value: 'hora_medicion'},
            {text: 'VALOR TEMPERATURA', value: 'medicion_temp'},
            {text: 'VALOR HUMEDAD', value: 'medicion_hum'}
          ],

          items: [],
          
          id:  '',
          date_medition: '',
          stringTable: 'MOSTRAR TABLA',
          btnTableColor: 'success',
          isTableVisible: false,
          selectedFilter: [],
          numberRules: [
              v => /^\d+$/.test(v) || 'Solo ingrese números',
          ],

          dateRules: [
              v => /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/.test(v) || 'YYYY-MM-DD'
          ], 
       }; 
    },

    methods: {
      // método para cambiar la visibilidad de la tabla
      changeTableVisibility(){
        if (this.isTableVisible){
          this.isTableVisible = false;
          this.btnTableColor = 'success',
          this.stringTable = 'MOSTRAR TABLA'
        }else{
           this.isTableVisible = true;
           this.btnTableColor = 'error',
           this.stringTable = 'OCULTAR TABLA'
        }
      },

      getCurrentItems(callback){
        callback(this.items);
      },

      // método para hacer las consultas teniendo en cuenta los filtros 
      async addFilter(){
        let filter = {};
        filter.filters = [];
        filter.filters.push({filters:[]})


        if (this.selectedFilter.indexOf('id') != -1 && this.id != ''){
          filter.filters[0].filters.push({id: this.id});
        }

      if (this.selectedFilter.indexOf('fecha_medicion') != -1 && this.date_medition != ''){
        filter.filters[0].filters.push({fecha_medicion: this.date_medition});
      }

        let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/measures`
        let config = {headers: {authorization: localStorage.getItem("token")}};

        // se hace la petición para la consulta de las mediciones
        try{
            let res = await axios.post(url, {filter}, config);

            // si no hay autorización
            if (!res.data.auth){
                // se redirige al login
                // se reinician los token guardados anteriormente
               localStorage.removeItem('email');
               localStorage.removeItem('token');
               this.$router.push('login');
               return;
            }

            // se actualiza la tabla
            this.items = res.data.data;
        }catch(err){
            
        }

        // se intenta actualizar la tabla en caso de que exista
        try {
          this.$refs.table.updateTable(this.items);
        }catch(err){
           return;
        }
      },
    },
 }
</script>

<style scoped>
  #btn-filter{
    background:rgba(66,194,60,1);
    color:white;
  }

  #btn-filter:hover{
    color: white;
    background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
    transition: 0.5s ease-in-out;
  }
</style>
