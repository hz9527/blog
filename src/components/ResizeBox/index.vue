<template>
  <div
    :class="[
      'resizebox-container',
      'resizebox-' + direction,
      screenState !== null ? screenState ? 'resizebox-side-max' : 'resizebox-side-min' : '']"
  >
    <div
      ref="side"
      class="resizebox-side"
      :style="sideStyle"
    >
      <slot name="side" />
    </div>
    <div
      ref="dragger"
      class="resizebox-dragger"
    />
    <div class="resizebox-main">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import Dragger from '../../utils/Dragger'
import { resizeFactory, resolveState } from './utils'
import { CustomThis } from '../../types/index'
import { FactoryRes, Direction } from './types'

interface CustomProps {
  $dragger: Dragger;
}
type T = CustomThis<CustomProps>

export default defineComponent({
  customeProps (): CustomProps {
    return {
      $dragger: null as unknown as Dragger
    }
  },
  props: {
    initState: {
      type: String as PropType<Direction>,
      default: 'bottom'
    }
  },
  emits: ['drag'],
  data () {
    return {
      ...resolveState(this.initState),
      values: {
        vertical: -1,
        horizontal: -1
      }
    }
  },
  computed: {
    sideStyle (): Record<string, string> {
      if (this.values.vertical === -1) {
        return {}
      }
      if (this.direction === 'left' || this.direction === 'right') {
        return { width: this.values.vertical + 'px' }
      } else {
        return { height: this.values.horizontal + 'px' }
      }
    }
  },
  mounted () {
    let res: FactoryRes
    ;(this as unknown as T).$dragger = new Dragger(this.$refs.dragger as Element, {
      start: () => {
        this.$emit('drag', true)
        this.start()
        res = resizeFactory(this.direction, this.values) // todo
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
      if (~this.values.vertical) {
        return
      }
      const rect = (this.$refs.side as Element).getBoundingClientRect()
      this.values = {
        vertical: rect.width,
        horizontal: rect.height
      }
    }
  }
})
</script>

<style lang="less" scoped>
.resizebox-container {
  display: flex;
  .resizebox-side {
    overflow: hidden;
    flex-shrink: 0;
  }
  .resizebox-dragger {
    flex-grow: 0;
    flex-shrink: 0;
  }
  .resizebox-main {
    flex-grow: 1;
  }
  &.resizebox-max {
    resizebox-side,
    .resizebox-dragger {
      display: none;
    }
  }
  &.resizebox-min {
    resizebox-main,
    .resizebox-dragger {
      display: none;
    }
  }
}
@dir: {
  top: column;
  right: row-reverse;
  bottom: column-reverse;
}
each(@dir, {
  .resizebox-@{key} {
    flex-direction: @value;
  }
});
.resizebox-left,
.resizebox-right {
  .resizebox-dragger {
    width: 3px;
    cursor: ew-resize;
    border-left: 1px solid #f55;
  }
}
.resizebox-top,
.resizebox-bottom {
  .resizebox-dragger {
    height: 3px;
    width: 100%;
    cursor: row-resize;
    border-bottom: 1px solid #f55;
  }
}
</style>
