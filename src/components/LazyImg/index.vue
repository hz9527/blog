<template>
  <img
    :src="src"
    @click="clickHandler"
  >
</template>
<script lang="tsx">
import { defineComponent } from 'vue'
import Preview from '../common/preview.vue'

export default defineComponent({
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  methods: {
    clickHandler () {
      this.$modal.show(<Preview src={this.src}/>)
    }
  }
})
</script>
