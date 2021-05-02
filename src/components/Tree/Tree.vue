<template>
  <template
    v-for="(item, index) in data"
    :key="index"
  >
    <slot
      :name="item[extraKey].name"
      :data="item"
      :deep="deep"
    />
    <div
      :class="{kids: true, fold: folds[index].fold}"
      @click="toggle(index)"
    >
      <Tree
        v-if="item.children && item.children.length"
        :data="item.children"
        :extra-key="extraKey"
        :deep="deep + 1"
      >
        <template
          v-for="name in item[extraKey].names"
          :key="name"
          #[name]="props"
        >
          <slot
            :name="name"
            :data="props.data"
            :deep="props.deep"
          />
        </template>
      </Tree>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Data } from './type'
export default defineComponent({
  name: 'Tree',
  props: {
    data: {
      default: () => [],
      type: Array as PropType<Data<Record<string, any>, string>>
    },
    extraKey: {
      type: String,
      default: ''
    },
    deep: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      folds: [] as {canFold: boolean; fold: boolean}[]
    }
  },
  watch: {
    data: {
      handler () {
        this.folds = this.data.map(item => ({
          canFold: item[this.extraKey].canFold,
          fold: item[this.extraKey].fold
        }))
      },
      immediate: true
    }
  },
  methods: {
    toggle () {

    }
  }
})
</script>
