<template>
  <div :class="['tab-item', visiable ? '' : 'hide']">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CHILD_NAME, checkParent } from './utils'

export default defineComponent({
  name: CHILD_NAME,
  props: {
    title: {
      type: String,
      required: true
    },
    checked: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    useId (): string | number {
      return this.id || this.title
    },
    visiable (): boolean {
      const parent: any = this.$parent || { checked: false }
      return this.useId === parent.checked
    }
  },
  watch: {
    $props: {
      handler () {
        checkParent(this.$parent) && this.$parent.updateItem()
      },
      deep: true
    },
    'parent.checked' (v) {

    }
  },
  created () {
    checkParent(this.$parent) && this.$parent.addItem(this)
  },
  beforeUnmount () {
    checkParent(this.$parent) && this.$parent.removeItem(this)
  }
})
</script>

<style lang="less" scoped>
.tab-item {
  width: 100%;
  flex-shrink: 0;
  opacity: 1;
  &.hide {
    transition: opacity 0.3s;
    opacity: 0;
  }
}
</style>
