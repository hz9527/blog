import 'vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $modal: {
      show: (content: string | Object) => void;
      hide: () => void;
    }
  }
}
