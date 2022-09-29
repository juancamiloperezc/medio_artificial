<template>
  <div> 
    <v-container>
      <v-container 
        fluid 
        fill-height
        align-center
        justify-center
      >
        <v-container> 
          <v-card
              elevation="24"
              outline 
              shapped 
              round
          >
            <!--  Sección del titulo del formulario -->
            <v-app-bar>
              <v-card-title> INFORMACIÓN </v-card-title>
            </v-app-bar> 
            
            <!-- sección de los campos del formulario -->
            <v-container
              m-5
            >
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                >
                
                <v-text-field
                  prepend-icon="mdi-account"
                  v-model="names"
                  type="text"
                  label="Nombres"
                  outlined
                  required
                  
                  :counter="50"
                  :rules="textRules" 
                  v-on:keyup.enter="validateForm"
                >
                </v-text-field>
                
                <v-text-field
                  prepend-icon="mdi-account"
                  v-model="lastNames"
                  type="text"
                  label="Apellidos"
                  outlined
                  required
                  
                  :counter="50"
                  :rules="textRules" 
                  v-on:keyup.enter="validateForm"
                >
                </v-text-field>

                <v-text-field
                  prepend-icon="mdi-email"
                  v-model="email"
                  type="email"
                  label="Correo Electrónico"
                  outlined
                  required
                  
                  :counter="50"
                  :rules="emailRules" 
                  v-on:keyup.enter="validateForm"
                >
                </v-text-field>

                <v-text-field
                  prepend-icon="mdi-lock"
                  v-model="password"
                  type="password"
                  label="Contraseña"
                  outlined
                  required
                  
                  :counter="50"
                  :rules="textRules" 
                  v-on:keyup.enter="validateForm"
                >
                </v-text-field>
                
                <v-container fluid fill-height align-center justify-center> 
                  <v-btn>
                     REGISTRARSE
                  </v-btn>  
                </v-container>
              </v-form>
            </v-container>  
          </v-card>
        </v-container>    
      </v-container>  
    </v-container> 
  </div>  
</template>

<script>
  export default {
    name: 'HelloWorld',
    
    components: {

    },
    
    methods: {
        
    }
  }

</script>

<style scoped>
</style>
