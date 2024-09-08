import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// note* no need to import styles.. we have no option but to 
// serve default vuetify.min.css using frappe's built in bundling system
// see this app's hook.py
// import 'vuetify/styles'
import {
  VBtn,
  VCard, 
  VCardTitle,
  VCardSubtitle,
  VCardActions,
  VSelect,
  VTextField,
  VTable,
  VIcon,
} from 'vuetify/components'

import { createPinia } from 'pinia'

import AppComponent from './App.vue'

import { initialize } from  './sales-invoice'

const app = createApp(AppComponent)

app.config.globalProperties.__ = __
app.config.globalProperties.format_number = format_number
app.config.globalProperties.format_currency = format_currency
app.config.globalProperties.frappe = window.frappe

// ** Vuetify setup **
const vuetify = createVuetify(
  {
    icons: {
      defaultSet: 'mdi',
      aliases: {
        ...aliases,
      },
      sets: {
        mdi,
      },
    },
    components: {
      VBtn,
      VCard, 
      VCardTitle,
      VCardSubtitle,
      VCardActions,
      VSelect,
      VTextField,
      VTable,
      VIcon,
    },
    defaults: {
      global: {
        density: 'compact',

      },
      VSelect: {
        variant: 'filled',
        flat: true,
      },
    },
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#2490EF',
          },
        },
      },
    },
  },
)
app.use(vuetify)

const pinia = createPinia()
app.use(pinia)

function appMount (rootContainer: string | Element): void {
  app.mount(rootContainer)
}

declare global {
  interface Document {
    __LAMSA__mountQueryDialogBody: typeof appMount
  }
}

window.document.__LAMSA__mountQueryDialogBody = appMount

initialize()