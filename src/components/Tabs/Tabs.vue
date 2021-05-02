<template>
  <div class="tabs-container">
    <div
      class="ui-tab-container"
      @click="pickTab"
    >
      <div
        v-for="(item, index) in tabs"
        :key="index"
        :class="['ui-tab', item.id === checked ? 'ui-tab-act' : '']"
        :data-ind="index"
      >
        {{ item.title }}
      </div>
    </div>
    <div class="tabs-viewport">
      <div
        class="tabs-content"
        :style="style"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getTargetChild } from '../../utils/utils'
import { checkChild, PARENT_NAME, resolveTabs } from './utils'
import { Child, Item } from './types'
import { CustomThis } from '../../types/index'

interface CustomProps {
  $items: Child[],
  $checked: Item['id'] | null
}

type T = CustomThis<CustomProps>

export default defineComponent({
  name: PARENT_NAME,
  customProps (): CustomProps {
    return {
      $items: [],
      $checked: null
    }
  },
  data () {
    return {
      tabs: [] as Item[],
      checked: null as Item['id'] | null,
      changed: false
    }
  },
  computed: {
    style (): Record<string, string> {
      if (this.checked === null) {
        return { transform: 'translate(100%, 0)' }
      }
      const ind = this.tabs.findIndex(item => item.id === this.checked)
      return { transform: `translate(-${100 * ind}%, 0)` }
    }
  },
  watch: {
    changed (v) {
      if (v) {
        const { tabs, checked } = resolveTabs((this as unknown as T).$items)
        this.tabs = tabs
        if (checked !== (this as unknown as T).$checked) {
          (this as unknown as T).$checked = checked
          this.checked = checked
        }
        if (!this.checked && tabs.length) {
          this.checked = tabs[0].id
        }
        this.$nextTick(() => {
          this.changed = false
        })
      }
    }
  },
  methods: {
    pickTab (e: MouseEvent) {
      const tab = getTargetChild(e) as HTMLElement | null
      if (tab && tab.dataset.ind) {
        this.checked = this.tabs[tab.dataset.ind as unknown as number].id
      }
    },
    addItem (item: Child) {
      if (!checkChild(item)) {
        return
      }
      const ind = (this as unknown as T).$items.indexOf(item)
      if (ind === -1) {
        ;(this as unknown as T).$items.push(item)
        Promise.resolve().then(() => {
          this.changed = true
        })
      }
    },
    removeItem (item: Child) {
      if (!checkChild(item)) {
        return
      }
      const ind = (this as unknown as T).$items.indexOf(item)
      if (~ind) {
        ;(this as unknown as T).$items.splice(ind, 1)
        this.changed = true
      }
    },
    updateItem () {
      this.changed = true
    }
  }
})
</script>

<style lang="less" scoped>
.tabs-viewport {
  width: 100%;
  overflow: hidden;
  .tabs-content {
    display: flex;
    width: 100%;
    overflow: visible;
    transform: translate(100%, 0);
    transition: transform 0.3s;
  }
}
</style>
