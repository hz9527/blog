<template>
  <Tree
    :data="tree.data"
    :extra-key="extraKey"
  >
    <template
      v-for="name in tree.names"
      :key="name"
      #[name]="props"
    >
      <slot
        :name="name"
        :data="props.data"
        :deep="props.deep"
        :fold="props.fold"
      />
    </template>
  </Tree>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Tree from './Tree.vue'
import wrapTree from './help'
import { ROOT_KEY } from './utils'
import { Tree as TreeType } from '../../types/index'
import { Data, Options } from './type'

export default defineComponent({
  name: 'Root',
  components: {
    Tree
  },
  props: {
    data: {
      default: () => [],
      type: Array as PropType<TreeType<Record<string, any>>>
    },
    config: {
      type: Object as PropType<Options<Record<string, any>, string>>,
      required: true
    }
  },
  computed: {
    tree (): {data: Data<Record<string, any>, string>, names: string[]} {
      return wrapTree(this.data, this.config)
    },
    extraKey (): string {
      return this.config.key || ROOT_KEY
    }
  }
})
</script>
