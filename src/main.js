// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import theme from '@/theme.js'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {store} from './vuex/store'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import VueSession from 'vue-session'
import interceptorSetup from '@/utils/api/interceptorConfig.js'
import uploader from 'vue-simple-uploader'
import VCalendar from 'v-calendar'
Vue.use(VCalendar, {
  componentPreFix: 'vc',
});

// Vue.config.productionTip = false
Vue.use(Vuetify, {theme});
Vue.use(VueAxios, axios);
Vue.use(VueMomentJS, moment);
Vue.use(VueSession);
Vue.use(uploader);

interceptorSetup(axios, store)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app');
