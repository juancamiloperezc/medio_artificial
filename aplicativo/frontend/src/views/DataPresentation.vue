<template>
  <div>
   <v-container>
      <v-card>
         <v-app-bar>
            <v-card-title>
               DATOS FINCA  
            </v-card-title>
         </v-app-bar>   
      </v-card>
   </v-container>
  </div>
</template>

<script>
import DataTable from '@/components/ComponentsDashboard/DataTable.vue'
import axios from 'axios'

export default {

   name: "DataPresentation",
   components:{DataTable},
   data: () =>{
      return {
          dataProperty: [] 
      }
   },

   methods:{
      async consulterId(id){
            // se hace la petición para agregar un nuevo predio o finca
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
   },

   mounted: async function(){
      // se realiza la petición para consultar los datos de la propiedad actual
      let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/consultPropertie`
      let config = {headers: {authorization: localStorage.getItem("token")}};

      try{
         let res = await axios.post(url, {id:this.$route.params.id}, config);
         this.dataProperty = {
            nombre: res.data.data[0].nombre,
            id: res.data.data[0].id,
            agricultor: await this.consulterId(res.data.data[0].id_agricultor),
            ingeniero: await this.consulterId(res.data.data[0].id_ingeniero)
         }

         console.log(this.dataProperty);
      }catch(err){
         
      }
   }
}
</script>

<style scoped> 

</style>

