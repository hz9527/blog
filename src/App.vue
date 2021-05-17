<template>
  <div class="body">
    <Modal />
    <div class="header" />
    <div class="container">
      <aside>
        <Menu />
      </aside>
      <router-view />
      <aside>
        <Headlines />
      </aside>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import Menu from './components/menu.vue'
import Modal from './components/Singles/Modal.vue'
import eventBus from './utils/event'
import Preview from './components/common/preview.vue'
import { useModal } from './utils/hook'

export default defineComponent({
  name: 'App',
  components: {
    Menu,
    Modal
  },
  setup () {
    const modal = useModal()
    const handler = (e: UIEvent) => {
      const target = e.target as HTMLImageElement
      if (target.nodeName === 'IMG' && target.dataset.type === 'preview') {
        modal.show(<Preview src={target.src} />)
      }
    }
    onMounted(() => {
      eventBus.on('bodyClick', handler)
    })
    onBeforeUnmount(() => {
      eventBus.off('bodyClick', handler)
    })
  }
})
</script>

<style lang="less" scoped>
  .body {
    height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .header {
    flex-shrink: 0;
  }
  .container {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }
</style>
