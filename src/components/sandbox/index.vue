<template>
  <div class="container">
    <Resizebox
      :init-state="resizeBoxState.editor"
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
        <Resizebox
          class="result-con"
          :ignores="['top', 'bottom']"
          :init-state="resizeBoxState.result"
          @drag="drag"
        >
          <template #side>
            <div class="result-item">
              <div class="title">
                渲染
              </div>
              <div
                ref="iframeContent"
                :class="['iframe', isDrag ? 'mask' : '']"
              />
            </div>
          </template>
          <div class="result-item">
            <div class="title">
              输出
            </div>
            <div
              class="log"
              v-html="log"
            />
          </div>
        </Resizebox>
        <div class="btn-con">
          <div
            class="ui-button"
            @click="reset"
          >
            reset
          </div>
          <div
            class="ui-button"
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
import { defineComponent, PropType } from 'vue'
import { Tabs, TabItem } from '../Tabs'
import Resizebox from '../ResizeBox/index.vue'
import Runtime from './runtime'
import { resolveLog, InitState, getState } from './utils'
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
    initState: {
      type: Object as PropType<InitState>, // true/fasle/null
      default: () => ({
        editor: null,
        result: null
      })
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
  computed: {
    resizeBoxState (): Record<string, string> {
      return {
        editor: getState(this.initState.editor),
        result: getState(this.initState.result)
      }
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
    border: 1px solid var(--color);
    .btn-con {
      display: flex;
      justify-content: flex-end;
      padding: 5px 0;
      border-top: 1px solid var(--border);
      .ui-button {
        margin-right: 10px;
      }
    }
  }
  .code-con {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .result {
    flex-grow: 1;
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
