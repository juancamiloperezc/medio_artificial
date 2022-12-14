import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
     infoAuthUser: {}, // estado para los datos del usuario logueado
     isAuth: false, // estado para verificar la autenticación de un usuario 
     redirectValid: false, // estado para revisar si la redirección para los datos de los colinos es valida
  },
  
  getters: {
      logedUser(state){
         return state.infoAuthUser;
      },

      isRedirectValid(state){
         return state.redirectValid;
      }
  },


  mutations: {
     updateInfoAuthUser(state, data){ // mutation para actualizar el estado de la información de usuario logueado
         state.infoAuthUser = data;
     },
     
     updateAuth(state, status){ // mutation para actualizar el estado de autenticación del usuario
         state.isAuth = status;
     }, 

     updateRedirectValid(state, sta){
         state.redirectValid = sta;
     }
  },

  actions: {

      async verifyAuth({commit}){
         // se verifica existencia de los datos del usuario
         if (localStorage.getItem("email") == null || localStorage.getItem("token") == null){
            // se actualizan los estados 
            commit("updateInfoAuthUser", {}); 
            commit("updateAuth", false);
            return;
         }

         let data = {email: localStorage.getItem("email")}; // se recuperan los datos  
         let config = {headers: {authorization: localStorage.getItem("token")}};

         // en caso de que existan datos guardados se hace la petición de verificación
         try{
              let url = `${process.env.VUE_APP_URL_API}:${process.env.VUE_APP_PORT_API}/login/valid`  
              // se hace la petición para verificar el token
              let res = await axios.post(url, data, config);
              
              //console.log(res.data.data);
              // se actualiza la autenticación
              commit("updateInfoAuthUser", res.data.data); 
              commit("updateAuth", true);
              return;
    
         }catch(err){ // en caso de error
               // se muestra alerta al usuario
               commit("updateInfoAuthUser", {}); 
               commit("updateAuth", false);
               return;
         }
      },

      
  },
  modules: {
  }
})
