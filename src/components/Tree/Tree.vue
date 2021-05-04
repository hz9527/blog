<template>
  <template
    v-for="(item, index) in data"
    :key="index"
  >
    <div
      class="tree-parent"
      @click="toggle(index)"
    >
      <slot
        :name="item[extraKey].name"
        :data="item"
        :deep="deep"
        :fold="folds[index].fold"
      />
    </div>
    <transition
      name="tree-kids"
    >
      <div v-show="!folds[index].fold">
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
              :fold="props.fold"
            />
          </template>
        </Tree>
      </div>
    </transition>
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
    toggle (ind: number) {
      const item = this.folds[ind]
      if (item.canFold) {
        item.fold = !item.fold
      }
    }
  }
})
</script>

<style lang='less'>
.tree-kids-enter-active {
  animation: child-animation 0.2s;
  transform-origin: top;
}
.tree-kids-leave-active {
  animation: child-animation 0.2s reverse ease-in;
  transform-origin: top;
}
.tree-kids-leave-to {
  transform: scale(1, 0);
}
@keyframes child-animation {
  0% {
    transform: scale(1, 0);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
