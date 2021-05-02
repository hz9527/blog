<template>
  <div class="rich-content">
    <span
      v-for="(item, index) in list"
      :key="index"
      :class="['item', item.hl ? 'item-hl' : item.value ? '' : 'item-empty']"
    >
      {{ item.value }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Item } from './utils'

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<Item>,
      default: () => []
    }
  }
})
</script>

<style lang="less">
.rich-content {
  .item {
    display: inline-block;
  }
  .item-hl {
    color: #f55;
  }
  .item-empty {
    width: 5px;
  }
}
</style>
