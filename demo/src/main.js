import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

Vue.config.productionTip = false

Vue.prototype.$t = function(text) { return text }
      // if not using i18n...
      
new Vue({
  render: h => h(App),
}).$mount('#app')
