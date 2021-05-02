<template>
  <div class="container">
    <Resizebox
      init-state="left"
      @drag="drag"
    >
      <template #side>
        <Tabs>
          <tab-item title="HTML">
            <textarea v-model="htmlValue" />
          </tab-item>
          <tab-item title="CSS">
            <textarea v-model="cssValue" />
          </tab-item>
          <tab-item title="JS">
            <textarea v-model="jsValue" />
          </tab-item>
        </Tabs>
      </template>
      <div class="result">
        <div class="result-con">
          <div
            ref="iframeContent"
            :class="['iframe', isDrag ? 'mask' : '']"
          />
          <div
            class="log"
            v-html="log"
          />
        </div>
        <div class="btn-con">
          <div
            class="btn"
            @click="reset"
          >
            reset
          </div>
          <div
            class="btn"
            @click="run"
          >
            run
          </div>
        </div>
      </div>
    </Resizebox>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Tabs, TabItem } from '../Tabs'
import Resizebox from '../ResizeBox/index.vue'
import Runtime from './runtime'
import { resolveLog } from './utils'
import { CustomThis } from '../../types/index'

interface CustomProps {
  $runtime: Runtime
}

type T = CustomThis<CustomProps>

export default defineComponent({
  components: {
    TabItem,
    Tabs,
    Resizebox
  },
  props: {
    html: {
      type: String,
      default: ''
    },
    css: {
      type: String,
      default: ''
    },
    js: {
      type: String,
      default: ''
    },
    showCode: {
      type: Boolean,
      default: true
    },
    initRun: {
      type: Boolean,
      default: true
    }
  },
  customProps (): CustomProps {
    return {
      $runtime: null as unknown as Runtime
    }
  },
  data () {
    return {
      htmlValue: this.html,
      cssValue: this.css,
      jsValue: this.js,
      tab: 'html',
      log: '',
      isDrag: false
    }
  },
  mounted () {
    (this as unknown as T).$runtime = new Runtime(this.$refs.iframeContent as Element)
    ;(this as unknown as T).$runtime.on('console', (data) => {
      this.log += resolveLog(data)
    })
    this.initRun && this.run()
  },
  unmounted () {
    (this as unknown as T).$runtime.destroy()
  },
  methods: {
    reset () {
      this.htmlValue = this.html
      this.cssValue = this.css
      this.jsValue = this.js
      this.run()
    },
    run () {
      this.log = ''
      ;(this as unknown as T).$runtime.update({
        html: this.htmlValue,
        css: this.cssValue,
        js: this.jsValue
      })
    },
    drag (v: boolean) {
      this.isDrag = v
    }
  }
})
</script>

<style lang="less" scoped>
  .container {
    border: 1px solid #333;
  }
  .code-con {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .result {
    flex-grow: 1;
    .result-con {
      display: flex;
      .log {
        flex-grow: 1;
      }
    }
  }
  .mask {
    position: relative;
  }
  .mask::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
</style>
