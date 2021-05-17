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

* 两个相邻的元素都设置了margin 并且两个margin有重叠，那么更大的设置会被保留，小的则会消失（外边距叠加）

  * 理论上水平方向不会触发边距塌陷 [reference](https://www.w3.org/TR/CSS2/box.html#collapsing-margins)
  * 对于 block element 也可以理解为水平方向也会触发边距塌陷，具体见下方示例
  * margin 重叠 还可以还可以穿透，如 ul 下 li margin 会穿透

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

## BFC

### IFC、GFC、FFC

## 层叠上下文

## 包含块

## 总结

[视觉格式化模型](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Visual_formatting_model)
