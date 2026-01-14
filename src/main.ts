import { createApp } from 'vue'
import App from './App.vue'
import disablePreventDefault from './plugins/disable-prevent-default'
import pinia from './plugins/pinia'
import vuetify from './plugins/vuetify'

// Styles
import './styles/vuetify.scss'
import './styles/hackbar.scss'



createApp(App).use(vuetify).use(pinia).use(disablePreventDefault).mount('#app')
