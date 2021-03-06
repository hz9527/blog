# 重学 CSS 系列 —— CSS 世界观

<b class="kw">CSS 世界观</b>
<b class="kw">CSS 关键概念</b>

本系列一共由 5 个部分组成：  
[CSS 世界观](./1-index.md)  
[语言语法和形式](./2-setup.md)  
[值与单位](./3-value.md)  
[深入布局](./4-layout.md)  
[进阶](./5-advance.md)  

CSS 世界观主要描述 CSS 中一些基本概念及原则，如盒模型、BFC、层叠上下文等等；  
语言语法和形式则会介绍 CSS 基本语法规则继承关系、优先级等；  
值与单位一节则会介绍 CSS rule 中 value 的取值类型、单位等；  
深入布局则会将 flex、grid 布局进行讲解；  
进阶则是一些高阶用法介绍。

> Tips: 如果你是完全新手，建议最开始看第二部分

## 关键概念

```mindMap
* [关键概念](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
** [语言语法和形式](https://developer.mozilla.org/zh-CN/docs/CSS/Syntax)
** 继承、优先级和级联
** 盒子模型和外边距合并
** 包含块
** 块级格式化上下文和层叠上下文
** 值与单位
** 深入理解布局
```

## 流（文档流 normal flow）

> 在 w3c 规范中没有 document flow 这一概念，只有 [normal flow](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Normal_Flow)

默认的，块级元素按照基于其父元素的书写顺序(默认值: horizontal-tb)的块流动方向(block flow direction)放置 --- 每个块级元素会在上一个元素下面另起一行，它们会被设置好的margin 分隔。

### 行为描述

* 默认从左到右（inline/inline-block），从上到下（block）
* 默认 block 宽度为父元素 100%，高度为内容高度
* 默认 inline/inline-block 宽度高度由内容决定，前者还无法单独设置宽高

  * inline padding/margin 左右生效，上下 “不生效”（占据渲染但不占据空间，并且遵循文档流顺序覆盖）

* 两个相邻的元素都设置了margin 并且两个[margin有重叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)，那么更大的设置会被保留，小的则会消失（外边距叠加）

  * 理论上水平方向不会触发边距塌陷 [reference](https://www.w3.org/TR/CSS2/box.html#collapsing-margins)
  * 对于 block element 也可以理解为水平方向也会触发边距塌陷，具体见下方示例
  * margin 重叠 还可以还可以穿透，如 ul 下 li margin 会穿透，即 margin 重叠除了兄弟块之间还有父子块

行内元素示例

```sandbox
// html
<div class="container">
  <div>
    内部都是 inline <span>span1</span>
    inline padding/margin 左右生效，上下 “不生效”（占据渲染但不占据空间，并且遵循文档流顺序覆盖）
    <span>span2</span><span>span3</span>
  </div>
  <div>
    内部都是 inline block
    <span class="inline-block">span4</span><span class="inline-block">span5</span>
  </div>
</div>

// css
span {
  background: #3ee;
  padding: 20px;
  margin: 20px;
}
.inline-block {
  display: inline-block;
}
```

左右边距重叠示例

```sandbox
// html
<div></div>
<div></div>
<div></div>

// css
div {
  width: 100px;
  height: 100px;
  border: 10px solid #f55;
  border-top-color: #3ee;
  margin: 20px;
}
body {
  writing-mode: vertical-lr;
}
```

使用 display、float、position、table、Multi-column 等都可能改变默认布局行为，具体见 [深入布局](./4-layout.md)

### 标签分类

HTML (超文本标记语言) 元素大多数都是行内元素（包含 inline/inline-block/inline-table）或块级元素。另外很多我们以为是行内块的元素（如 img）实际上是 inline，其特殊性是可以设置宽高，但是实际是因为它属于 [可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)

在 CSS 中，可替换元素（replaced element）的展现效果不是由 CSS 来控制的。这些元素是一种外部对象，它们外观的渲染，是独立于 CSS 的。典型可替换元素有：iframe、video、img、embed。还有一些标签在特定条件下也属于可替换元素，如 canvas、input 等

## 盒子模型

![boxModel {"maxWidth": "300px"}](../../../assets/blogs/boxmodel.png)

在盒子模型里，一共分为 4 个区域（由内到外）：

1. 内容区域（content area）
2. 内边距区域（padding area）
3. 边框区域（border area）
4. 外边距区域（margin area）

### 宽高计算

在 文档流 中简单介绍过，块级盒子默认宽度为父容器宽度，高度为内部高度。在正常情况下，设置盒子宽高是指 内容区域，因此当盒子存在 margin、padding、border 等情况下，设置宽度 100%，则会超出父元素。

可以通过 `box-sizing` 来改变这一默认行为，其取值除了正常取值外，主要为 `content-box`(default) & `border-box`，设置为后者则宽高设置为整个边框区域

### 背景计算

默认背景计算衍生到 border area 外边缘，可以通过 [`background-clip`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-clip) 设置

### 定位计算

1. float: 从 content area 计算，如左浮动为
2. position(absolute\fixed): 从 border area 内边缘计算

## BFC

> BFC(Block Formatting Context) 块级格式化上下文

### 是什么？

> 它是一个**独立的渲染区域**，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

### 如何形成？

### 相关应用

**清除浮动带来影响**

**消除父子元素 margin 折叠**

**使用 float 消除兄弟元素 margin 折叠**

### IFC、GFC、FFC

## 层叠上下文

## 包含块

## 总结

[视觉格式化模型](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Visual_formatting_model)
[reference](https://juejin.cn/post/6844903894313598989)
<https://github.com/zuopf769/notebook/blob/master/fe/BFC%E5%8E%9F%E7%90%86%E5%89%96%E6%9E%90/README.md>

<https://juejin.cn/post/6844903497045917710>
