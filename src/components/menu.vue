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
          <div :class="['dir ui-ellipsis', props.fold ? 'dir-fold' : '', 'dir' + props.deep]">
            <span
              class="fold-icon"
            >&#9660;</span><span
              class="ui-icon-large dir-icon"
            />{{ props.data.title }}
          </div>
        </template>
        <template #item="props">
          <div :class="['item', current === props.data.hash ? 'item-current' : '', 'item' + props.deep]">
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
    color: var(--color-primary);
    .ui-icon-large {
      vertical-align: bottom;
    }
    .dir-icon {
      -webkit-mask-position: -140px 192px;
      background-color: var(--color-primary);
    }
    .fold-icon {
      font-size: @font-s-size;
      display: inline-block;
      transform: rotate(0deg);
      transition: transfrom 0.2s;
    }
  }
  .dir-fold {
    .fold-icon {
      transform: rotate(270deg);
    }
  }
  @itemPadding: 20px;
  @step: 15px;
  .item {
    padding: 5px 5px 5px @itemPadding;
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
  @deep: 1, 2, 3, 4;
  each(@deep, {
    .dir@{value} {
      padding-left: @value * @step;
    }
    .item@{value} {
      padding-left: @itemPadding + @value * @step;
    }
  });
}
</style>
