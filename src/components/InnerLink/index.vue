<template>
  <router-link :to="to">
    {{ content }}
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RoutesConfig } from '../../router/data'

export default defineComponent({
  props: {
    href: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    to (): string {
      const [file, hash] = this.href.split('#')
      const item = RoutesConfig.find(item => item.file === file)
      return item ? (hash ? `${item.hash}#${hash}` : item.hash) : ''
    }
  }
})
</script>

<style lang="less" scoped>
</style>
