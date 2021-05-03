<template>
  <div class="search-container">
    <input
      v-model="value"
      type="text"
      placeholder="搜索 标题、关键字、类型..."
      class="input"
      @blur="blurHandler"
    >
    <div
      class="result-panel"
      @click="chooseHandler"
    >
      <div
        v-show="!result.length && value"
        class="empty"
      >
        暂无搜索结果
      </div>
      <div
        v-for="item in result"
        :key="item.path"
        class="result-item"
        :data-path="item.path"
      >
        <div class="title">
          <Rich :list="item.title" />
        </div>
        <div
          v-for="(info, index) in item.data"
          :key="index"
          class="content ui-ellipsis"
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
import { getTargetChild } from '../../utils/utils'
import { CustomThis } from '../../types'

interface CustomProps {
  $itemClicked: boolean;
}
type T = CustomThis<CustomProps>

const BLUR_TIME = 200

export default defineComponent({
  components: { Rich },
  customProps (): CustomProps {
    return {
      $itemClicked: false
    }
  },
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
  },
  created () {
    this.gloablClick = this.gloablClick.bind(this)
  },
  unmounted () {
    document.removeEventListener('click', this.gloablClick)
  },
  methods: {
    chooseHandler (e: UIEvent) {
      const target = getTargetChild(e) as HTMLElement | null
      if (!target || !target.dataset.path) {
        return
      }
      this.$router.push(target.dataset.path)
      ;(this as unknown as T).$itemClicked = true
      document.removeEventListener('click', this.gloablClick)
      setTimeout(() => {
        document.addEventListener('click', this.gloablClick, { once: true })
      }, 50)
    },
    blurHandler () {
      setTimeout(() => {
        if (!(this as unknown as T).$itemClicked) {
          this.value = ''
        } else {
          (this as unknown as T).$itemClicked = false
        }
      }, BLUR_TIME)
    },
    gloablClick () {
      this.value = ''
      ;(this as unknown as T).$itemClicked = false
    }
  }
})
</script>

<style lang="less">
@import '../../styles/theme.less';
.search-container {
  position: relative;
  .input {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
  .result-panel {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    margin-top: 5px;
    background: var(--panelBg);
    box-shadow: var(--shadow);
    border-radius: @panel-radius;
  }
  .empty {
    padding: 20px 0;
    text-align: center;
    color: var(--color-light);
    font-size: @font-xs-size;
  }
  .result-item {
    padding: 5px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-light);
    box-sizing: border-box;
    width: 100%;
    &:last-child {
      border-bottom: 0;
    }
    &:hover {
      background: var(--light-hover-bg);
    }
    .title {
      font-weight: 600;
      font-size: @font-l-size;
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
