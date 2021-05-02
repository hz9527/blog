<template>
  <div
    ref="container"
    :class="['container', classNames.container]"
    :style="style.container"
    @mouseleave="closePanel"
  >
    <div :class="['content', classNames.content, contentClass]">
      <div
        ref="resizeBar"
        :class="['resize-bar', resizeBarActive ? 'resize-bar-active' : '']"
        :style="style.resizeBar"
      />
      <div
        ref="asideBar"
        class="aside-bar"
        :style="style.asideBar"
        @click="open"
      >
        <div class="aside-bar-con">
          <div
            class="aside-bar-text"
            @mouseenter="openPanel"
          >
            <slot name="asideBar">
              目录
            </slot>
          </div>
          <div
            ref="asideDragger"
            class="aside-bar-dragger"
          >
            =
          </div>
        </div>
      </div>
      <div
        class="panel"
        :style="style.panel"
      >
        <div class="panel-header">
          <div
            class="close"
            @click="close"
          >
            {{ pin && !fold ? 'close' : '' }}
          </div>
          <div
            class="pin"
            @click="togglePin"
          >
            {{ pin ? 'pin' : 'unpin' }}
          </div>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { getDefaultConf, computedStyle, computedClassName, resize, moveAsideFactory, Styles, ClassNames } from './help'
import Dragger from '../../utils/Dragger'
import { CustomThis } from '../../types/index'

interface CustomProps {
  $dragger: Dragger;
  $asideBarDragger: Dragger;
  $size: number;
}
type T = CustomThis<CustomProps>;

export default defineComponent({
  props: {
    initConfig: {
      type: Object,
      default: getDefaultConf
    }
  },
  data () {
    return {
      ...getDefaultConf(),
      ...this.initConfig,
      resizeBarActive: false,
      showPanel: false
    }
  },
  computed: {
    style (): Styles {
      return computedStyle(this)
    },
    classNames (): ClassNames {
      return computedClassName(this)
    },
    contentOpened (): boolean | null {
      if (this.float) {
        return null
      }
      return this.pin ? !this.fold : this.resizeBarActive || this.showPanel
    },
    contentClass (): string {
      if (this.contentOpened === null) {
        return ''
      }
      return this.contentOpened ? 'content-open' : 'content-close'
    }
  },
  customProps (): CustomProps {
    return {
      $dragger: null as unknown as Dragger,
      $asideBarDragger: null as unknown as Dragger,
      $size: -1
    }
  },
  mounted () {
    (this as unknown as T).$dragger = new Dragger(this.$refs.resizeBar as Element, {
      start: () => {
        this.initSize()
        this.size = (this as unknown as T).$size
        this.resizeBarActive = true
      },
      move: (info) => {
        this.size = resize(this, (this as unknown as T).$size, info)
      },
      end: () => {
        this.resizeBarActive = false
      }
    })
    let move: ReturnType<typeof moveAsideFactory>
    (this as unknown as T).$asideBarDragger = new Dragger(this.$refs.asideDragger as Element, {
      start: () => {
        move = moveAsideFactory(
          this,
          this.$refs.container as Element,
          this.$refs.asideBar as Element
        )
      },
      move: (info) => {
        this.asideValue = move(info)
      }
    }, 'move')
  },
  methods: {
    initSize () {
      (this as unknown as T).$size = this.size === -1
        ? (this.$refs.container as Element).getBoundingClientRect()[this.aside === 'vertical' ? 'width' : 'height']
        : this.size
    },
    togglePin () {
      this.pin = !this.pin
    },
    close () {
      this.fold = true
    },
    open () {
      if (!this.float && this.pin && this.fold) {
        this.fold = false
      }
    },
    openPanel () {
      if (!this.float && !this.pin) {
        this.showPanel = true
      }
    },
    closePanel () {
      if (!this.float && !this.pin) {
        this.showPanel = false
      }
    }
  }
})
</script>

<style lang='less' scoped>
.container {
  position: relative;
  &.container-vertical {
    height: 100%;
  }
  &.container-horizontal {
    width: 100%;
  }
}
.content {
  transition: transform 0.3s;
  .aside-bar {
    display: none;
    position: absolute;
    .aside-bar-con {
      cursor: pointer;
      display: flex;
      border: 1px solid #333;
      background: #666;
      .aside-bar-dragger {
        padding: 5px;
        background: #f55;
        cursor: move;
      }
    }
  }
  .resize-bar {
    display: none;
    position: absolute;
    cursor: col-resize;
    background: #f55;
    opacity: 0;
    transition: opacity 0.3s;
    &:hover {
      opacity: 0.8;
      transition: opacity 0.3s;
    }
  }
  .resize-bar-active {
    opacity: 0.8;
  }
}

.content-left,
.content-right {
  height: 100%;
  .aside-bar-con {
    writing-mode: vertical-lr;
  }
}

.content-top,
.content-bottom {
  width: 100%;
}

.content-left.content-close {
  transform: translate(-100%, 0);
}

.content-right.content-close {
  transform: translate(100%, 0);
}

.content-top.content-close {
  transform: translate(0, -100%);
}

.content-bottom.content-close {
  transform: translate(0, 100%);
}

.content.content-close {
  position: absolute;
  top: 0;
  left: 0;
  .aside-bar {
    display: block;
    opacity: 1;
    transition: 0.3s 0.3s;
    transition-property: opacity, transform;
    transform: translate(0, 0);
  }
}

.content.content-open {
  position: relative;
  transform: translate(0, 0);
  .aside-bar {
    display: block;
    visibility: hidden;
    opacity: 0;
    transform: translate(-100%, 0);
  }
}

</style>
