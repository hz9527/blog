<template>
  <div
    ref="container"
    :class="[
      'resizebox-container',
      'resizebox-' + direction,
      screenState !== null ? (screenState ? 'resizebox-max' : 'resizebox-min') : '']"
  >
    <div
      v-show="screenState === false"
      class="aside"
      @click="screenState=null"
    >
      <span class="ui-icon-large" />
    </div>
    <div
      ref="side"
      class="resizebox-side"
      :style="sideStyle"
    >
      <div class="operation-box">
        <div
          class="left"
          @click="leftOpersHandler"
        >
          <div
            v-for="item in operationConf.left"
            :key="item"
            :data-icon="item"
            :class="['icon-' + item, 'ui-icon-large']"
          />
        </div>
        <div
          class="right"
          @click="rightOpersHandler"
        >
          <div
            v-for="item in operationConf.right"
            :key="item"
            :data-icon="item"
            :class="['icon-' + item, 'ui-icon-large', !screenState && direction === item ? 'icon-disabled' : '']"
          />
        </div>
      </div>
      <slot name="side" />
    </div>
    <div
      ref="dragger"
      class="resizebox-dragger"
    />
    <div
      ref="main"
      class="resizebox-main"
      :style="mainStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dragger from '../../utils/Dragger'
import { resizeFactory, resolveState, resolveIgnores, getTargetIcon, getWidth } from './utils'
import { CustomThis } from '../../types/index'
import { FactoryRes, Direction, State, OperationConf } from './types'

interface CustomProps {
  $dragger: Dragger;
  $info: number; // container width
}
type T = CustomThis<CustomProps>

export default defineComponent({
  customProps (): CustomProps {
    return {
      $dragger: null as unknown as Dragger,
      $info: -1
    }
  },
  props: {
    initState: {
      type: String as PropType<State>,
      default: 'bottom'
    },
    ignores: {
      type: Array as PropType<State[]>,
      default: () => []
    }
  },
  emits: ['drag'],
  data () {
    return {
      ...resolveState(this.initState),
      values: {
        vertical: -1,
        horizontal: -1,
        mainHorizontal: -1
      }
    }
  },
  computed: {
    operationConf (): OperationConf {
      return resolveIgnores(this.ignores)
    },
    sideStyle (): Record<string, string> {
      if (this.values.vertical === -1 || this.screenState === true) {
        return {}
      }
      if (this.direction === 'left' || this.direction === 'right') {
        return { width: this.values.vertical + 'px' }
      } else {
        return { height: this.values.horizontal + 'px' }
      }
    },
    mainStyle (): Record<string, string> {
      if (
        this.values.mainHorizontal === -1 ||
        this.screenState !== null ||
        this.direction !== 'bottom'
      ) {
        return {}
      }
      return { height: this.values.mainHorizontal + 'px' }
    }
  },
  mounted () {
    let res: FactoryRes
    ;(this as unknown as T).$dragger = new Dragger(this.$refs.dragger as Element, {
      start: () => {
        this.$emit('drag', true)
        this.start()
        res = resizeFactory(this.direction, this.values, (this as unknown as T).$info)
        ;(this as unknown as T).$dragger.setCursor(res.key === 'vertical' ? 'ew-resize' : 'row-resize')
      },
      move: (info) => {
        this.values[res.key] = res.getValue(info)
      },
      end: () => {
        this.$emit('drag', false)
      }
    })
  },
  methods: {
    start () {
      if (this.direction !== 'bottom') {
        let conWidth: number | undefined
        if ((this as unknown as T).$info === -1 || this.direction === 'left' || this.direction === 'right') {
          const container = (this.$refs.container as Element).getBoundingClientRect()
          ;(this as unknown as T).$info = container.width
          conWidth = container.width
        }
        if (~this.values.vertical) {
          return
        }
        const rect = (this.$refs.side as Element).getBoundingClientRect()
        this.values = {
          ...this.values,
          vertical: getWidth(rect.width, conWidth),
          horizontal: rect.height
        }
      } else {
        if (~this.values.mainHorizontal) {
          return
        }
        const rect = (this.$refs.main as Element).getBoundingClientRect()
        this.values = {
          ...this.values,
          mainHorizontal: rect.height
        }
      }
    },
    leftOpersHandler (e: UIEvent) {
      const icon = getTargetIcon(e)
      if (icon) {
        this.screenState = icon !== 'min'
      }
    },
    rightOpersHandler (e: UIEvent) {
      const icon = getTargetIcon(e)
      if (icon) {
        this.direction = icon as Direction
        this.screenState = null
      }
    }
  }
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
