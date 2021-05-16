<template>
  <div class="preview-container">
    <div
      class="header"
      @click="close"
    >
      close
    </div>
    <img :src="src">
  </div>
</template>
<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  methods: {
    close () {
      this.$modal.hide()
    }
  }
})
</script>
