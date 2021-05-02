<template>
  <div class="body">
    <div class="contianer">
      <aside class="menu">
        <Menu />
      </aside>
      <div class="content">
        <router-view />
      </div>
      <aside class="titles">
        <Headlines />
      </aside>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Menu from './components/Menu.vue'

export default defineComponent({
  name: 'App',
  components: {
    Menu
  }
})
</script>

<style lang="less" scoped>
  .body {
    box-sizing: content-box;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .header {
    padding: 0 200px;
  }
  .contianer {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    .menu,
    .content,
    .titles {
      height: 100%;
    }
  }
</style>
