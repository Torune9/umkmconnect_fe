import './css/style.css'

//in your `main.js` file
import 'flowbite'
import '../node_modules/flowbite-vue/dist/index.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import library from './service/fontAwesome'
import {BarChart,PieChart} from 'vue-chart-3'
import regChart from './service/vueChart'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import pinia from './service/pinia'

const app = createApp(App)

app.use(regChart)
app.use(library)
app.use(pinia)
app.use(router)

app.component('bar-chart',BarChart)
app.component('pie-chart',PieChart)
app.component('font-awesome-icon',FontAwesomeIcon)
app.component('EasyDataTable',Vue3EasyDataTable)

app.mount('#app')
