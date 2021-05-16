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

<script lang="ts">
import { defineComponent } from 'vue'
import Menu from './components/menu.vue'
import Modal from './components/Singles/Modal.vue'

export default defineComponent({
  name: 'App',
  components: {
    Menu,
    Modal
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
