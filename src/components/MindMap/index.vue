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
      <Select
        :choosed="template"
        :list="templates"
        panel-class="mindmap-template-panel"
        @selected="templateHandler"
      >
        <template
          v-for="item in templates"
          :key="item.value"
          #[item.value]="props"
        >
          <div
            class="mindmap-template-item"
            :class="[
              props.role === 'item' ? 'mindmap-template-panel-item' : '',
              props.role === 'item'
                && props.data.value === template
                ? 'mindmap-item-selected' : ''
            ]"
            :style="props.data.style"
          />
        </template>
      </Select>
      <Select
        class="theme-select"
        :choosed="theme"
        :list="themes"
        panel-class="mindmap-theme-panel"
        @selected="themeHandler"
      >
        <template
          v-for="item in themes"
          :key="item.value"
          #[item.value]="props"
        >
          <div
            class="mindmap-theme-item"
            :class="[
              props.role === 'item' ? 'mindmap-theme-panel-item' : '',
              props.role === 'item'
                && props.data.value === theme ? 'mindmap-item-selected' : ''
            ]"
            :style="props.data.style"
          >
            {{ props.data.name }}
          </div>
        </template>
      </Select>
    </div>
    <div ref="root" />
    <div class="operation">
      <div
        class="zoom"
        @click="zoomHandler"
      >
        <div
          class="zoom-item zoom-in"
          data-type="zoomIn"
        >
          +
        </div>
        <div
          class="zoom-item zoom-out"
          data-type="zoomOut"
        >
          -
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MindMap from './mindmap'
import Select from '../Select/index.vue'
import { Item } from './utils'
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
      this.templates = templates
      this.themes = themes
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
    },
    templateHandler (v: string) {
      (this as unknown as T).$mindMap.setTemplate(this.template = v)
    },
    themeHandler (v: string) {
      (this as unknown as T).$mindMap.setTheme(this.theme = v)
    }
  }
})
</script>

<style lang="less">
@import '../../styles/theme.less';
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
    align-items: flex-end;
    .theme-select {
      margin-left: 20px;
    }
  }
  .operation {
    position: absolute;
    bottom: 20px;
    left: 20px;
    .zoom-item {
      cursor: pointer;
      text-align: center;
    }
  }
}
.mindmap-template-item {
  width: 50px;
  height: 40px;
  background: url('./template.png') no-repeat;
  &.mindmap-item-selected {
    background-color: var(--color-disable);
    &:hover {
      background-color: var(--color-disable);
    }
  }
}
.mindmap-template-panel-item:hover {
  background-color: var(--light-hover-bg);
}
.mindmap-template-panel {
  .item {
    padding: 5px 10px;
  }
}

.mindmap-theme-item {
  display: inline-block;
  padding: 5px 10px;
  cursor: pointer;
  font-size: @font-s-size;
  &.mindmap-item-selected {
    opacity: 0.5;
    &:hover {
      opacity: 0.5;
    }
  }
}
.mindmap-theme-panel-item:hover {
  opacity: 0.8;
}
.mindmap-theme-panel {
  .item {
    display: inline-block;
    margin: 5px;
  }
}
</style>
