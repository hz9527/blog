<template>
  <div class="select-container">
    <dit class="current">
      <slot
        :name="choosed"
        role="choosed"
        :data="choosedData"
      />
    </dit>
    <div class="items">
      <div
        v-for="item in list"
        :key="item.value"
        class="item"
      >
        <slot
          :name="item.value"
          :data="item"
          role="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    list: {
      type: Array, // {name, value}[]
      default: () => []
    },
    choosed: {
      type: String,
      default: ''
    }
  },
  computed: {
    choosedData (): any {
      return this.list.find((item: any) => item.value === this.choosed)
    }
  },
  methods: {
    chooseHandler () {

    }
  }
})
</script>

<style lang="less">
@import '../../styles/theme.less';
.select-container {
  position: relative;
  .items {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--panelBg);
    box-shadow: var(--shadow);
    border-radius: @panel-radius;
    z-index: 1000;
  }
}
</style>
