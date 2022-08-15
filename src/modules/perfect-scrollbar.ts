import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import type { UserModule } from '~/types'

// Setup Json Viewer
// https://www.npmjs.com/package/vue-json-viewer
export const install: UserModule = ({ isClient, app }) => {
  if (!isClient)
    return

  app.use(PerfectScrollbar)
}

