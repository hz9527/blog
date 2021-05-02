<template>
  <div
    v-show="tree.length"
    class="headlines-container"
  >
    <Tree
      :data="tree"
      :config="config"
    >
      <template
        v-for="i in 4"
        #[i+1]="props"
        :key="i"
      >
        <a
          :class="'head h' + (i + 1) + ' ' + (states[props.data.value] ? ' head-lh' : '')"
          :href="'#' + props.data.value"
        >
          {{ props.data.name }}
        </a>
      </template>
    </Tree>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tree from '../Tree/index.vue'
import Scroll from './Scroll'
import getTree from './utils'
import { CustomThis } from '../../types/index'

interface CustomProps {
  $scroll: Scroll
}

type T = CustomThis<CustomProps>

export default defineComponent({
  components: {
    Tree
  },
  customProps (): CustomProps {
    return {
      $scroll: new Scroll({
        changeHandler: (states) => {
          this.states = { ...states } as any
        }
      })
    }
  },
  data () {
    return {
      config: {
        getName (item: {level: number}): number {
          return item.level
        }
      },
      tree: getTree(this.$route.path),
      states: {} as {[k: string]: boolean}
    }
  },
  watch: {
    $route (v) {
      this.tree = getTree(v.path)
      this.$nextTick(() => {
        (this as unknown as T).$scroll.update(this.tree)
      })
    }
  },
  mounted () {
    (this as unknown as T).$scroll.update(this.tree)
  }
})
</script>

<style lang="less" scoped>
@import '../../styles/theme.less';
.headlines-container {
  position: fixed;
  top: 100px;
  right: 50px;
  padding: 10px 15px;
  background: var(--panelBg);
  box-shadow: var(--shadow);
  .head {
    display: block;
    text-decoration: none;
    &:hover {
      color: var(--textHover);
    }
  }
  .head-lh {
    color: var(--color-primary);
  }
  .h2 {
    font-size: @font-s-size;
  }
  .h3 {
    margin-left: 10px;
    font-size: @font-xs-size;
  }
  .h4 {
    margin-left: 20px;
    font-size: @font-xxs-size;
  }
}
</style>
