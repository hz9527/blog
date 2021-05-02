<template>
  <div :class="['container', classes.container, min === null ? '' : 'fold']">
    <div
      v-show="min === true"
      class="aside"
      @click="min = null"
    >
      展开
    </div>
    <div :class="['side', classes.side]">
      <div class="resize" />
      <div class="content">
        <div class="header">
          <div
            :class="['header-item', 'min', min === true ? 'disabed' : '']"
            @click="checkout('min')"
          >
            min
          </div>
          <div
            :class="['header-item', 'max', min === false ? 'disabed' : '']"
            @click="checkout('max')"
          >
            max
          </div>
          <div
            :class="['header-item', 'top', direction === 'top' ? 'disabed' : '']"
            @click="checkout('top')"
          >
            top
          </div>
          <!-- <div
            :class="['header-item', 'right', direction === 'right' ? 'disabed' : '']"
            @click="checkout('right')"
          >
            right
          </div> -->
          <div
            :class="['header-item', 'bottom', direction === 'bottom' ? 'disabed' : '']"
            @click="checkout('bottom')"
          >
            bottom
          </div>
          <div
            :class="['header-item', 'left', direction === 'left' ? 'disabed' : '']"
            @click="checkout('left')"
          >
            left
          </div>
        </div>
        <slot name="side">
          side
        </slot>
      </div>
    </div>
    <div :class="['main', classes.main]">
      <div class="resize" />
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export type Direction = 'top' | 'left' | 'right' | 'bottom'

export type State = Direction | 'min' | 'max'

export type Min = boolean | null

export interface Classes {
  container: string;
  side: string;
  main: string;
}
export default defineComponent({
  props: {
    initState: {
      type: String,
      default: 'left'
    }
  },
  data () {
    return {
      direction: this.initState as Direction,
      min: null as Min
    }
  },
  computed: {
    classes (): Classes {
      const v = this.direction
      let main, side
      if (v === 'top' || v === 'left') {
        main = 'normal-base'
        side = `resize-base resize-${v === 'top' ? 'horizontal' : 'vertical'}`
      } else {
        side = 'normal-base'
        main = `resize-base resize-${v === 'bottom' ? 'horizontal' : 'vertical'}`
      }
      return {
        container: `container-${v}`,
        side: side + (this.min === null ? '' : this.min ? ' content-min' : ' content-max'),
        main: main + (this.min === null ? '' : !this.min ? ' content-min' : ' content-max')
      }
    }
  },
  methods: {
    checkout (type: State) {
      if (type !== 'min' && type !== 'max') {
        this.direction = type
        this.min = null
      } else if (type === 'min') {
        this.min = true
      } else {
        this.min = false
      }
    }
  }
})
</script>

<style lang='less' scoped>
.container {
  display: flex;
  .side {
    .header {
      height: 20px;
      display: flex;
      justify-content: flex-end;
      .header-item {
        cursor: pointer;
        margin-left: 5px;
        &.disabed {
          pointer-events: none;
          opacity: 0.5;
        }
      }
    }
  }
}
@dir: {
  top: column;
  right: row-reverse;
  bottom: column-reverse;
}
each(@dir, {
  .container-@{key} {
    flex-direction: @value;
  }
});

.resize-base {
  position: relative;
  display: flex;
  &::before {
    content: '';
    display: block;
    flex-grow: 1;
  }
  .resize {
    overflow: scroll;
    opacity: 0;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
}
.normal-base {
  flex-grow: 1;
  .resize {
    display: none;
  }
  .content {
    width: 100%;
    height: 100%;
  }
}
.fold {
  position: relative;
  .aside {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.5;
  }
  .resize-base {
    border: 0;
    .resize {
      resize: none;
    }
    .content {
      bottom: 0;
      right: 0;
    }
  }
  .content-max {
    flex-grow: 1;
    max-height: 100%;
    max-width: 100%;
  }
  .content-min {
    display: none;
  }
}

.resizeDirection(@directio: vertical) {
  @main: if(@directio = vertical, width, height);
  @side: if(@directio = vertical, height, width);
  @cMain: if(@directio = vertical, right, bottom);
  @cSide: if(@directio = vertical, bottom, right);
  .custom (@d) when (@d = vertical) {
    height: inherit;
  }
  .custom (@d) when (@d = horizontal) {
    flex-direction: column;
  }
  max-@{main}: 80%;
  min-@{main}: 20%;
  .custom(@directio);
  border-@{cMain}: 1px solid #f55;
  .resize {
    resize: if(@directio = vertical, horizontal, vertical);
    height: if(@directio = vertical, inherit, 100%);
    max-@{main}: 100%;
    &::-webkit-scrollbar {
      @{side}: if(@directio = vertical, inherit, 100vw);
      @{main}: 5px;
    }
  }
  .content {
    @{cMain}: 5px;
    @{cSide}: 0;
  }
}

.resize-vertical {
  .resizeDirection(vertical);
}

.resize-horizontal {
  .resizeDirection(horizontal);
}

</style>
