## 学习笔记

### 组件

抛开框架和具体实现，来看组件的概念和组成：

组件化是模块化开发的基础，能够提高代码的复用率和开发效率；是对 markup 表达能力的扩充。

学习 React 的时候，好像只是从实现角度去看该怎么写一个组件，而没有跳出各个框架的差异，从更高的角度来看一个组件应该具备什么。这貌似也是我一直的毛病，缺少方法论。

#### 组件的组成：

使用者 -> 组件（Input）

- Property
- Attribute
- Config
- Children

组件 -> 使用者（Output）

- Event
- Method
- LifeCycle

自身维护

- State

#### Property VS Attribute VS Config

Property 和 Attribute 看设计者的设计，二者可以相同，也可以不同

Config 一般是固定的，不会更改

#### LifeCycle

created -> mount -> render -> update -> unmount -> destroyed

#### Children

形成属性结构，对 UI 界面有更强的描述能力

- 内容型
- 模板型/函数型

### 轮播组件

轮播组件的实现，感觉更需要一些实现上的技巧

自动轮播：

- 轮播方向固定
- 轮播图之间的衔接：只需要考虑当前帧和后一帧的位置关系

手势控制轮播：

- 方向不定
- 需要考虑当前帧和前后两帧的位置关系
- mouseup 时要考虑移动距离是否超过轮播图的一半，只有当前帧和前或者后一帧有关
- 涉及到的位置计算需要好好理解