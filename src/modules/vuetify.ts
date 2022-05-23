import 'vuetify/styles/main.sass'

import { createVuetify } from 'vuetify'
import { type UserModule } from '~/types'
import { isDark } from '~/composables'

// Import Vuetify
export const install: UserModule = ({ app }) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: isDark ? 'dark' : 'light',
    },
  })

  app.use(vuetify)
}
