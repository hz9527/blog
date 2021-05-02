<template>
  <Tool>
    <div class="content">
      <Tree
        :data="tree"
        :config="config"
      >
        <template #title="props">
          <div class="title">
            {{ props.data.title }}
          </div>
        </template>
        <template #item="props">
          <div class="item">
            {{ props.data.title }}
          </div>
        </template>
      </Tree>
    </div>
  </Tool>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tool from './Tools/index.vue'
import Tree from './Tree/index.vue'
import { Tree as tree } from '../router/data'

export default defineComponent({
  components: {
    Tree,
    Tool
  },
  data () {
    return {
      tree,
      config: {
        getName (data: any): string {
          if (data.file) {
            return 'item'
          } else {
            return 'title'
          }
        }
      }
    }
  }
})
</script>

<style lang="less" scoped>
.content {
  height: 100%;
}
.title {
  background: #f55;
}
</style>
