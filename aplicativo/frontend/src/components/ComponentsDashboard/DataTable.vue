<template>
 <div>
  <v-data-table
    :headers="headers"
    :items="desserts"
    class="elevation-1"
  >
    <template v-slot:item.medicion_temperatura="{ item }">
      <v-chip
        :color="getColor(item.medicion_temperatura)"
        dark
      >
        {{ item.medicion_temperatura }}
      </v-chip>
    </template>

    <template v-slot:item.medicion_humedad="{ item }">
      <v-chip
        :color="getColor(item.medicion_humedad)"
        dark
      >
        {{ item.medicion_humedad}}
      </v-chip>
    </template>

  </v-data-table>
 </div>
</template>

<script>
export default {
  name: 'DataTable',
  components: {},

  props:{
      desserts: Array,
      headers: Array
  },
  
  data () {
      return {
      }
   },

   methods: {
      getColor (calories) {
        if (calories > 400) return 'red'
        else if (calories > 200) return 'orange'
        else return 'green'
      },
    },
}
</script>

<style>


</style>
