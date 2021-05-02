<template>
  <Tool :init-config="toolConfig">
    <template #asideBar>
      目录
    </template>
    <template #header>
      <div class="menu-search">
        <Search />
      </div>
    </template>
    <div class="menu-content">
      <Tree
        :data="tree"
        :config="config"
      >
        <template #title="props">
          <div :class="['dir ui-ellipsis', props.fold ? 'dir-fold' : '']">
            {{ props.data.title }}
          </div>
        </template>
        <template #item="props">
          <div :class="['item', current === props.data.hash ? 'item-current' : '']">
            <router-link
              :to="'/' + props.data.hash"
              class="ui-ellipsis"
            >
              {{ props.data.title }}
            </router-link>
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
import Search from './Search/index.vue'
import { Tree as tree } from '../router/data'

export default defineComponent({
  components: {
    Tree,
    Tool,
    Search
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
        },
        getCanFold () {
          return true
        }
      },
      toolConfig: {
        resize: (size: number) => size > 500 ? 500 : size < 200 ? 200 : size
      }
    }
  },
  computed: {
    current (): string {
      return this.$route.path.slice(1)
    }
  }
})
</script>

<style lang="less">
@import '../styles/theme.less';
.menu-search {
  margin: 5px 20px 10px 20px;
}
.menu-content {
  height: 100%;
  overflow: auto;
  background: var(--asideBg);
  .dir,
  .item {
    padding: 10px 5px;
    min-width: 200px;
    max-width: 100%;
    box-sizing: border-box;
    &:hover {
      background: var(--asideHoverBg);
    }
  }
  .dir {
    cursor: pointer;
    // todo icon
  }
  .dir-fold {
    color: #f55;
  }
  .item {
    padding: 5px 5px 5px 20px;
    font-size: @font-s-size;
    a {
      display: block;
    }
  }
  .item-current {
    background:var(--selectedBg);
    &:hover {
      background:var(--selectedBg);
    }
    a {
      color: var(--colorInverse);
    }
  }
}
</style>
