import 'vuetify/styles/main.sass'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import { type UserModule } from '~/types'
import { isDark } from '~/composables'

// Import Vuetify
export const install: UserModule = ({ app }) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: isDark ? 'dark' : 'light',
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
  })

  app.use(vuetify)
}
