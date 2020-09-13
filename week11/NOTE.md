## 学习笔记

### 双向绑定

- getOwnPropertyDescriptor 
  - 一次只能监听对象的一个属性

- proxy
  - new Proxy(target, handler)
  - 可以监听整个对象
  - 可实现对数组的监听
  - 用于定义基本操作的自定义行为（属性查找、赋值、枚举、函数调用等）
  - 双向绑定的实现
    - 为避免不必要的监听，需要一个依赖收集的过程，对于调用了 get 方法的对象的对应属性，将要执行的副作用收集起来。当执行 set 时，执行副作用
    - 如果对象的属性是对象，要让对象属性也是用 proxy 代理，编程 reactive 的。为了保证同一个对象是同一个 proxy 对象，要将 proxy 对象收集起来，如果存在，则复用原来的对象
    - dom -> 数据
      - dom 事件，触发时改变数据
    - 数据 -> dom
      - 执行副作用函数

### 拖拽

实现一个元素跟随鼠标移动的拖拽，并可以参与布局的变化

注意点：

- 拖拽的实现方式
  - drag & drop
  - mousedown, mousemove, mouseup 事件模拟
    - 在 mousedown 触发时，添加 mousemove 和 mouseup 的监听，提升性能
    - mousemove 和 mouseup 事件需要添加到 document 上，防止拖动快速时，鼠标离开拖拽元素，失去响应
    - 元素位置的正确计算
- 让拖拽元素参与到布局中
  - 用 Range API 来精细控制元素的插入位置
  - 用 CSSOM API getBoudingClientRect 来计算元素位置
  - 当元素已经在 DOM 树的时候，把元素插入到其他位置会把元素从原位置移动到新位置，不需要手动执行先删除再插入的动作

