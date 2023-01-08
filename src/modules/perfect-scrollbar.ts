import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import type { UserModule } from '~/types'

// Setup Perfect Scrollbar
// https://github.com/mercs600/vue3-perfect-scrollbar
export const install: UserModule = ({ isClient, app }) => {
  if (!isClient)
    return

  app.use(PerfectScrollbar)
}

