<template>
  <teleport to="body">
    <div
      v-if="show"
      ref="self"
      :class="['panel-container', className]"
      :style="style"
      @click="clickHandler"
    >
      <slot />
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getStyle } from './utils'
import eventBus from '../../utils/event'
import { getTargetChild } from '../../utils/utils'

export default defineComponent({
  props: {
    root: {
      type: HTMLElement,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
  emits: ['autoClose', 'panelClick'],
  data () {
    return {
      init: this.show,
      state: this.show
    }
  },
  computed: {
    style (): Record<string, string> {
      if (!this.state || !this.root) {
        return {}
      }
      return getStyle(this.root)
    }
  },
  watch: {
    show (v) {
      this.state = v
      if (v && !this.init) {
        this.init = true
      }
    }
  },
  created () {
    this.bodyClick = this.bodyClick.bind(this)
    eventBus.on('bodyClick', this.bodyClick)
  },
  beforeUnmount () {
    eventBus.off('bodyClick', this.bodyClick)
  },
  methods: {
    bodyClick (e: UIEvent) {
      if (!this.state) {
        return
      }
      const target = getTargetChild(e)
      if (target !== this.$refs.self) {
        this.state = false
        setTimeout(() => {
          this.$emit('autoClose')
        })
      }
    },
    clickHandler (e: UIEvent) {
      this.$emit('panelClick', e)
    }
  }
})
</script>

<style lang="less">
@import '../../styles/theme.less';
.panel-container {
  display: none;
  position: absolute;
  background: var(--panelBg);
  box-shadow: var(--shadow);
  border-radius: @panel-radius;
  z-index: 1000;
  overflow: auto;
}
</style>
