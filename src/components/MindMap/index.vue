<template>
  <div
    ref="container"
    class="mindmap-container"
    :style="loading ? {height: maxHeight / 2 + 'px'} : {}"
  >
    <div
      v-show="loading"
      class="ui-loading loading"
    />
    <div class="header">
      <!-- <Select
        :choosed="template"
        :list="templates"
      >
        <template
          v-for="item in templates"
          :key="item.value"
          #[item.value]="props"
        >
          <div class="template">
            {{ props.data.name }}
          </div>
        </template>
      </Select>
      <Select
        :choosed="theme"
        :list="themes"
      >
        <template
          v-for="item in themes"
          :key="item.value"
          #[item.value]="props"
        >
          <div class="theme">
            {{ props.data.name }}
          </div>
        </template>
      </Select> -->
    </div>
    <div ref="root" />
    <div class="operation">
      <div
        class="zoom"
        @click="zoomHandler"
      >
        <div
          class="zoom-in"
          data-type="zoomIn"
        />
        <div
          class="zoom-out"
          data-type="zoomOut"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MindMap from './mindmap'
import Select from '../Select/index.vue'
import { Item, getList } from './utils'
import { getTargetChild } from '../../utils/utils'
import { CustomThis } from '../../types/index'

interface CustomProps {
  $mindMap: MindMap;
}
type T = CustomThis<CustomProps>

export default defineComponent({
  customProps (): CustomProps {
    return {
      $mindMap: new MindMap()
    }
  },
  components: { Select },
  props: {
    data: {
      type: [String, Object],
      default: '{"root": {"data": {"text": ""}}}'
    },
    maxHeight: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      loading: false,
      zoom: 100,
      theme: '',
      template: '',
      themes: [] as Item[],
      templates: [] as Item[]
    }
  },
  watch: {
    data () {
      this.init()
    }
  },
  mounted () {
    this.init()
    Promise.all([
      (this as unknown as T).$mindMap.getTemplates(),
      (this as unknown as T).$mindMap.getThemes()
    ]).then(([templates, themes]) => {
      this.templates = getList(templates)
      this.themes = getList(themes)
    })
  },
  methods: {
    init (): void {
      this.loading = true
      const maxWidth = (this.$refs.container as HTMLElement).getBoundingClientRect().width
      ;(this as unknown as T).$mindMap.render(
        this.$refs.root as HTMLElement,
        this.data,
        { maxHeight: this.maxHeight, maxWidth }
      ).then(() => {
        this.zoom = (this as unknown as T).$mindMap.getZoom()
        this.theme = (this as unknown as T).$mindMap.getTheme()
        this.template = (this as unknown as T).$mindMap.getTemplate()
        this.loading = false
      })
    },
    zoomHandler (e: UIEvent) {
      const target = getTargetChild(e) as HTMLElement | null
      if (!target) {
        return
      }
      const type = target.dataset.type
      let zoom: number | null = null
      if (type === 'zoomIn') {
        zoom = this.zoom > 310 ? null : this.zoom + 10
      } else {
        zoom = this.zoom < 20 ? null : this.zoom - 10
      }
      zoom && (this as unknown as T).$mindMap.setZoom(this.zoom = zoom)
    }
  }
})
</script>

<style lang="less">
.mindmap-container {
  position: relative;
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    z-index: 10;
  }
  .header {
    display: flex;
  }
  .operation {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
}
</style>
