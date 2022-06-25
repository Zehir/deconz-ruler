import JsonViewer from 'vue-json-viewer'
import { type UserModule } from '~/types'

// Setup Pinia
// https://pinia.esm.dev/
export const install: UserModule = ({ app }) => {
  app.use(JsonViewer)
}
