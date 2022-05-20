import 'vuetify/styles' // Global CSS has to be imported
import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import { type UserModule } from '~/types'

// Import Vuetify
export const install: UserModule = ({ app }) => {
  const vuetify = createVuetify({
    // Components will be imported by vite-plugin-components
    directives,
    theme: {
      defaultTheme: 'dark',
    },
  })

  app.use(vuetify)
}
