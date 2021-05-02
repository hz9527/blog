<template>
  <div class="search-container">
    <div class="input">
      <input
        v-model="value"
        type="text"
      >
    </div>
    <div class="result-panel">
      <div
        v-for="item in result"
        :key="item.path"
        class="result-item"
      >
        <div class="title">
          <Rich :list="item.title" />
        </div>
        <div
          v-for="(info, index) in item.data"
          :key="index"
          class="content"
        >
          <div :class="[info.calssName, 'label']">
            {{ info.title }}:
          </div>
          <Rich :list="info.match" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Rich from './rich.vue'
import { search, ResultItem } from './utils'

export default defineComponent({
  components: { Rich },
  data () {
    return {
      value: '',
      result: [] as ResultItem[]
    }
  },
  watch: {
    value (v) {
      this.result = search(v)
    }
  }
})
</script>

<style lang="less" scoped>
.search-container {
  .result-item {
    padding: 5px;
    border-bottom: 1px solid #f55;
    &:last-child {
      border-bottom: 0;
    }
  }
  .content {
    display: flex;
    .label {
      margin-right: 5px;
    }
  }
}
</style>
