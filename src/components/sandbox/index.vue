<template>
  <div class="container">
    <div class="code-con" v-show="showCode">
      <div class="ui-tab-container" v-click="switchTab">
        <div :class="['ui-tab', tab === 'html' ? 'ui-tab-act' : '']" data-tab="html">HTML</div>
        <div :class="['ui-tab', tab === 'css' ? 'ui-tab-act' : '']" data-tab="css">Style</div>
        <div :class="['ui-tab', tab === 'js' ? 'ui-tab-act' : '']" data-tab="js">JS</div>
      </div>
      <div class="code" v-show="tab === 'html'">
        <textarea v-model="htmlValue"></textarea>
      </div>
      <div class="code" v-show="tab === 'css'">
        <textarea v-model="cssValue"></textarea>
      </div>
      <div class="code" v-show="tab === 'js'">
        <textarea v-model="jsValue"></textarea>
      </div>
    </div>
    <div class="result">
      <div class="result-con">
        <div class="iframe" ref="iframeContent"></div>
        <div class="log"></div>
      </div>
      <div class="btn-con">
        <div class="btn">reset</div>
        <div class="btn" @click="run">run</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Runtime from './runtime'
export default defineComponent({
  props: {
    html: {
      type: String
    },
    css: {
      type: String
    },
    js: {
      type: String
    },
    showCode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      htmlValue: '',
      cssValue: '',
      jsValue: '',
      tab: 'html'
    }
  },
  created() {
    this.reset();
  },
  mounted() {
    this.runtime = new Runtime(this.$refs.iframeContent)
  },
  methods: {
    switchTab(e) {
      if ('tab' in e.target.dataset) {
        this.tab = e.target.dataset.tab;
      }
    },
    reset() {
      this.htmlValue = this.html;
      this.cssValue = this.css;
      this.js = this.css;
    },
    run() {
      this.runtime.update({
        html: this.htmlValue,
        css: this.cssValue,
        js: this.jsValue
      })
    }
  }
})
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    width: 100%;
    border: 1px solid #333;
  }
  .code-con {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .tabs {
      display: flex;
    }
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
</style>
