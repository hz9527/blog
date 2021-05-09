<template>
  <div class="select-container">
    <div
      ref="label"
      class="current"
      @click="openHandler"
    >
      <slot
        :name="choosed"
        role="choosed"
        :data="choosedData"
      />
      <span :class="['icon', showPanel ? 'icon-up' : '']">▼</span>
    </div>
    <Panel
      :root="$refs.label"
      :show="showPanel"
      :class-name="panelClass"
      @autoClose="showPanel = false"
      @panelClick="chooseHandler"
    >
      <div
        v-for="item in list"
        :key="item.value"
        class="item"
        :data-item="item.value"
      >
        <slot
          :name="item.value"
          :data="item"
          role="item"
        />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Panel from '../Panel/index.vue'
import { getTargetChild } from '../../utils/utils'

export default defineComponent({
  components: { Panel },
  props: {
    list: {
      type: Array, // {name, value}[]
      default: () => []
    },
    choosed: {
      type: String,
      default: ''
    },
    panelClass: {
      type: String,
      default: ''
    }
  },
  emits: ['selected'],
  data () {
    return {
      showPanel: false
    }
  },
  computed: {
    choosedData (): any {
      return this.list.find((item: any) => item.value === this.choosed)
    }
  },
  methods: {
    chooseHandler (e: UIEvent) {
      const target = getTargetChild(e) as HTMLElement | null
      if (!target) {
        return
      }
      const value = target.dataset.item
      if (!value || value === this.choosed) {
        return
      }
      this.showPanel = false
      this.$emit('selected', target.dataset.item)
    },
    openHandler () {
      this.showPanel = !this.showPanel
    }
  }
})
</script>

<style lang="less">
@import '../../styles/theme.less';
.select-container {
  .current {
    border: 1px solid var(--border);
    padding: 5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: @btn-radius;
    &:hover {
      border-color: var(--border-light);
      .icon {
        color: var(--border-light);
      }
    }
    .icon {
      display: inline-block;
      margin-left: 10px;
      transition: 0.2s;
      color: var(--border);
    }
    .icon-up {
      transform: rotate(180deg);
    }
  }
}
</style>
