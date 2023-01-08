import Previewer from 'virtual:vue-component-preview'
import { type UserModule } from '~/types'

// Setup Previewer
// https://github.com/johnsoncodehk/vite-plugin-vue-component-preview
export const install: UserModule = ({ app }) => {
  app.use(Previewer)
}
