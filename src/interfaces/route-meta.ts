export {}

declare module 'vue-router' {
  interface RouteMeta {

    // Set the breadcrumb display
    breadcrumbs?: 'page-name' | 'resource-path' | 'none' | 'hide'

    // Hide the level two sidebar. Default : false
    hideLevelTwoSidebar?: boolean
  }
}
