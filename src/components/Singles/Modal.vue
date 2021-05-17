<template>
  <teleport to="body">
    <div
      v-if="init"
      v-show="show"
      class="modal-container"
    >
      <div class="modal-content">
        <Content :jsx="child" />
      </div>
    </div>
  </teleport>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'
import Content from './modal-con.vue'
import { setGlobal, MODAL_KEY } from '../../utils/hook'
export default defineComponent({
  components: { Content },
  data () {
    return {
      child: null,
      show: false,
      init: false
    }
  },
  created () {
    setGlobal(this.$.appContext.app, MODAL_KEY, {
      show: (jsx: any) => {
        this.show = true
        this.child = jsx
      },
      hide: () => {
        this.show = false
      }
    })
    const unsub = this.$watch('show', () => {
      this.init = true
      unsub()
    })
  }
})
</script>

<style lang="less">
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  .modal-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
