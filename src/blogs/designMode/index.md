# 设计模式

<b class="kw">设计模式</b>
<b class="kw">设计原则</b>
<b class="hide">false</b>

## 设计模式是什么

**设计模式**是软件设计中常见问题的典型解决方案。 它们就像能根据需求进行调整的预制蓝图， 可用于解决代码中反复出现的设计问题。

设计模式与方法或库的使用方式不同， 你很难直接在自己的程序中套用某个设计模式。 模式并不是一段特定的代码， 而是解决特定问题的一般性概念。 你可以根据模式来实现符合自己程序实际所需的解决方案。

人们常常会混淆模式和算法， 因为两者在概念上都是已知特定问题的典型解决方案。 但算法总是明确定义达成特定目标所需的一系列步骤， 而模式则是对解决方案的更高层次描述。 同一模式在两个不同程序中的实现代码可能会不一样。

算法更像是菜谱： 提供达成目标的明确步骤。 而模式更像是蓝图： 你可以看到最终的结果和模式的功能， 但需要自己确定实现步骤。

模式的概念是由克里斯托佛·亚历山大在其著作 《建筑模式语言》 中首次提出的。 本书介绍了城市设计的 “语言”， 而此类 “语言” 的基本单元就是模式。 模式中可能会包含对窗户应该在多高、 一座建筑应该有多少层以及一片街区应该有多大面积的植被等信息的描述。

埃里希·伽玛、 约翰·弗利赛德斯、 拉尔夫·约翰逊和理查德·赫尔姆这四位作者接受了模式的概念。 1994 年， 他们出版了 《设计模式： 可复用面向对象软件的基础》 一书， 将设计模式的概念应用到程序开发领域中。 该书提供了 23 个模式来解决面向对象程序设计中的各种问题， 很快便成为了畅销书。 由于书名太长， 人们将其简称为 “四人组 （Gang of Four， GoF） 的书”， 并且很快进一步简化为 “GoF 的书”。

此后， 人们又发现了几十种面向对象的模式。 ​ “模式方法” 开始在其他程序开发领域中流行起来。 如今， 在面向对象设计领域之外， 人们也提出了许多其他的模式。

## 设计模式争议

> 如果你只有一把铁锤， 那么任何东西看上去都像是钉子。

- 一种针对不完善编程语言的蹩脚解决方案
  - 一些模式诞生之初是由于编程语言“缺陷”使得开发者需要使用相应模式来实现，但是当所选编程语言具备这些抽象能力设计模式则成为蹩脚的解决方案
- 低效的解决方案
  - 过于教条主义地使用设计模式将会使代码复杂化

## 设计模式分类

- **创建型模式**提供创建对象的机制， 增加已有代码的灵活性和可复用性。
  - 工厂方法（FactoryMethod）
  - 抽象工厂（AbstractFactory）
  - 原型（Prototype）
  - 单例（Singleton）

- **结构型模式**介绍如何将对象和类组装成较大的结构， 并同时保持结构的灵活和高效
  - 适配器模式（Adapter）
  - 桥接（Bridge）
  - 组合（Composite）
  - 装饰（Decorator）
  - 外观（Facade）
  - 享元（Flyweight）
  - 代理（Proxy）

- **行为模式**负责对象间的高效沟通和职责委派。
  - 责任链（Chain of Responsibility）
  - 命令（Command）
  - 迭代器（Iterator）
  - 中介者（Mediator）
  - 备忘录（Memento）
  - 观察者（Observer）
  - 状态（State）
  - 策略（Strategy）
  - 模板方法（TemplateMethod）
  - 访问者（Visitor）

## 设计原则

### 单一职责

### 里氏替换

### 依赖倒置

### 接口隔离

### 迪比特法则

### 开闭原则

```js
var a = 1
```