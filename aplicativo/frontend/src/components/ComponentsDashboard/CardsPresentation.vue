<template>
  <div>
   <v-container  id="background" fluid fill-height justify-center>
    <v-card
      class="mx-auto d-flex justify-start mb-6"
      :color = "info.color"
      flat
      tile
    >
    <div id = "space-card">
      <v-spacer >
      </v-spacer>  
    </div>

    <v-card id = "card-style">
      <v-card-title>
        {{info.title}}
      </v-card-title>

      <v-container>
       <p v-for="(subtitle, index) in info.subtitles" :key="index"> 
        {{subtitle}}
       </p> 
      </v-container> 
      
      <v-card-actions>
       <v-btn 
          block
          @click="$emit('callback', info.id)"
          :color="info.color"
          dark
        >
           MAS DETALLES
       </v-btn>
      </v-card-actions> 
     
     </v-card> 
    </v-card>
   </v-container>
  </div>
</template>

<script>
  export default{
     name: 'cardsPresentation',
     components: {},
     props: {
        info: Object,
     },

     data: ()=> {
        return{
          
        }
     }
  }
</script>

<style scoped>

  #background{
    background: rgba(178, 177, 177, 0.074);
  }

  #space-card{
    min-width: 5px;
    border-radius: 10px;
  }

  #card-style{
      background: white;
      font-weight: bold;
      max-width: 400px; 
      width: 250px;
  }
</style> 