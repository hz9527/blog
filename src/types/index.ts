export interface Headline {
  level: number;
  name: string;
  value: string;
}

interface BaseRoute {
  file: string
  title: string;
  hash: string;
  updateTime: number;
  headlines: Headline[];
  tips: string[];
  types: string[];
}
interface RouterDataItem {
  title: string;
  children: ((BaseRoute & {
    show: boolean;
  }) | RouterDataItem)[];
}
export type RouterData = RouterDataItem[];

export interface RouteItem extends BaseRoute {
  dirs: string[];
}

type TreeItem<D extends Record<string, any>> = D & {
  children: TreeItem<D>[]
}

export type Tree<D extends Record<string, any>> = TreeItem<D>[]

interface Pos {
  x: number;
  y: number;
}
export interface ToolConfig {
  fold: boolean; // 是否为收起状态
  pin: boolean; // 是否固定
  float: boolean; // 是否浮窗
  aside: 'vertical' | 'horizontal'; // 纵贴还是横贴
  vertical: 'top' | 'bottom'; // 垂直定位基准
  horizontal: 'left' | 'right'; // 水平定位基准
  size: number; // 展开 宽度/高度
  verticalValue: number; // 垂直定位位置
  horizontalValue: number; // 水平定位位置
  asideValue: number; // 浮标位置
  resize: (size: number) => number; // 侧边栏尺寸
  position: (pos: Pos) => Pos;
}

export type CustomThis<T extends Record<string, any>> = {
  [K in keyof T]: T[K]
}
