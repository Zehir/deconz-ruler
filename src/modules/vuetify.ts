import 'vuetify/styles/main.sass'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

// Labs
// https://next.vuetifyjs.com/en/labs/introduction/
import * as labs from 'vuetify/labs/components'

// https://github.com/Sjoerd82/vuetify-extra
// import 'vuetify-extra/styles.css'
// import { YSwitchLang } from 'vuetify-extra'

// https://github.com/logue/vuetify-swatches
import 'vuetify-swatches/dist/style.css'
import VSwatches from 'vuetify-swatches'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import { type UserModule } from '~/types'
import { isDark } from '~/composables'

// Import Vuetify
export const install: UserModule = ({ app }) => {
  const vuetify = createVuetify({
    components: {
      ...labs,
      VSwatches,
      // YSwitchLang,
    },
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
