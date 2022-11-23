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
            <v-app-bar dark id="background-title">
              <v-card-title id = "font-title-form"> INFORMACIÓN </v-card-title>
            </v-app-bar> 
            
            <!-- sección de los campos del formulario -->
            <v-container
              dark
              m-5
              id="background-form"
              elevation="24"
            >
              <v-form 
                ref="form"
                lazy-validation             
                >
                
                <v-text-field autocomplete="on"
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
                
                <v-text-field autocomplete="on"
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

                <v-text-field autocomplete="on"
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

                <v-text-field autocomplete="on"
                  prepend-icon="mdi-lock"
                  v-model="password"
                  label="Contraseña"
                  outlined
                  required
                  
                  :append-icon= "isShowPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type= "isShowPass?  'text' : 'password'"
                  @click:append= "()=>{isShowPass = ! isShowPass}"
                  v-on:keyup.enter="validateForm"
                  :rules="passwordRules"
                >
                </v-text-field>
                
                <v-container class="select-width" fluid fill-height justify-center> 
                 <v-container> 
                  <v-select 
                    outlined
                    v-model="role"
                    label="rol"
                    required

                    :items="roles"
                    :rules="[v => !!v || 'Rol requerido']"
                    v-on:keyup.enter="validateForm"
                  >
                  </v-select>
                </v-container> 
                </v-container> 

                <v-container fluid fill-height align-center justify-center> 
                  <v-btn
                   dark
                    block
                    id="background-btn-register"
                    @click="validateForm">
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
    name: 'FormRegister',

    data: () => {
      return {
          names: '',
          lastNames: '',
          email: '',
          password: '',
          role: '',
          isReset: true, 
          isShowPass: false,

          textRules: [
              v => !!v || 'Este campo es obligatorio' ,
              v => /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(v) || "Ingrese valor valido",
              v => v.length <= 50 || "máximo 50 caracteres"
           ],

           emailRules: [
             v => !!v || 'El Correo Electrónico es obligatorio',
             v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Ingrese Correo Electrónico válido',
          ],

          passwordRules: [
             v => !!v || 'La Contraseña es obligatoria'
          ],

          roles:  ["Dueño", "Ingeniero", "Agricultor"],

      };
    },
    
    components: {

    },
    
    methods: {
        // método para  validar el formulario
        validateForm(){

           if(this.$refs.form.validate()){ 
            // si los datos ingresados son validos 
            let dataUser ={
                 names: this.names, 
                 lastNames: this.lastNames, 
                 email: this.email, 
                 password: this.password,
                 rol: this.roles.indexOf(this.role) + 1
              };

              this.$emit("register", dataUser);
           }
        },

        // método para devolver los valores por defecto en el formulario
        resetForm(){
          this.names = "";
          this.lastNames = "";
          this.email = ""; 
          this.password = ""; 
          this.role = "";
        }

    }
  }

</script>

<style scoped>
  #background-title{
    background: rgb(81,255,81);
    background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
  }

  #background-form{
    background: #cbffcb;
  }

  #background-btn-register{
    background:rgba(66,194,60,1)
  }

  #background-btn-register:hover{
    color: white;
    background: linear-gradient(267deg, rgba(81,255,81,0.9962359943977591) 8%, rgba(66,194,60,1) 22%);
    transition: 0.5s ease-in-out;
  }

  #font-title-form{
    color: white;
    font-family: Impact;
  }

</style>
