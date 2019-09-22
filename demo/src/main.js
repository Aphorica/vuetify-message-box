import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'

import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.prototype.$t = function(text) { return text }
      // if not using i18n...
Vue.use(Vuetify)
      
new Vue({
  vuetify: new Vuetify({}),
  render: h => h(App),
}).$mount('#app')
