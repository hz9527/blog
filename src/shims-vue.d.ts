declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
  export interface ComponentCustomProperties {
    $test: 123
  }
}

declare module '*.md' {
  export const render: any
}

// eslint-disable-next-line no-unused-vars
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production'
  }
}
