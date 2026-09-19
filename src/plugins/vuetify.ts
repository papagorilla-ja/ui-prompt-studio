import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#090a0f',
          surface: '#12141c',
          'surface-variant': '#1b1e2a',
          primary: '#6366f1',
          secondary: '#38bdf8',
          accent: '#f43f5e',
          success: '#10b981',
          warning: '#f59e0b',
        },
      },
    },
  },
})
