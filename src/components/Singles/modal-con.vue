<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    jsx: {
      type: Object,
      default: null
    }
  },
  render () {
    return this.jsx
  }
})
</script>
