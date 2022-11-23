<template>
 <div>
  <v-container fluid fill-height justify-center align-start>
     <v-card id="backgroud-card" class="mx-auto" max-width="300">
      <v-container ml-3 mr-3>
        <v-card-title class="subtitle-1 font-weight-bold"> {{info.name}} </v-card-title>
        <v-card-subtitle> {{info.email}} </v-card-subtitle>
      </v-container>  
        <v-img id="form-img" class="mx-auto ma-2 mb-3" :src= "`${info.src}`"></v-img>
     </v-card>
   </v-container>
 </div> 
</template> 

<script>
  export default{
    name: 'cardIntegrant', 
    components: {

    },

    props: {
      info: Object, 
    },

    data: () => {
      return{

      };
    },

  };
</script>

<style scoped>
  #backgroud-card{
   background: rgb(15,149,15);
   background: linear-gradient(0deg, rgba(15,149,15,1) 0%, rgba(102,202,129,1) 39%, rgba(180,250,180,1) 95%);
  }

  #form-img{
    width: 200px;
    height: 300px;
    width: 80%;
    border-radius:10px;
  }
</style>