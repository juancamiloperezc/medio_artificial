<template>
  <div>
    <v-data-table
     :headers="headers"
     :items="items"
     class="elevation-1"
    >
     <template >
       jioas
     </template>
   </v-data-table>
  </div>
</template>

<script>
  export default{
     name: 'DataTableMain',
     component: {},
     
     props: {
        headers: Array,
     },

     data: () => {
        return{
            items: [],
        }
     },

     methods:{
        updateTable(items){
           this.items = items;
        }
     },

     mounted(){
         // se actualizan los items de la tabla
         this.$emit("getCurrentItems", (items) =>{
              this.items = items;
         });
     }
  }
</script>

<style>
</style>