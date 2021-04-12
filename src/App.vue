<template>
  <div class="body">
    <header class="header">
      header
    </header>
    <div class="contianer">
      <aside class="menu">
        test
      </aside>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>

<style lang="less" scoped>
  .body {
    height: 100vm;
  }
  .contianer {
    display: flex;
  }
</style>
