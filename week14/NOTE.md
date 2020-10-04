## 学习笔记

### 手势库封装

#### 事件类型

- tap 轻点屏幕
- press 点击屏幕超过 500ms，则认为触发 press 事件
- pan 移动距离超过 10px，则认为触发 pan 事件
- flick 移动速度超过 1.5px/s，则认为触发 flick 事件

#### 事件模拟

以上事件都由原生事件来模拟

##### Web 端

mousedown -> mousemove -> mouseup

##### 移动端

touchstart -> touchmove -> touchend, touchcancel

mouse 和 touch 事件的不同点：

touchmove 一定是在 touchstart 事件后触发的，而 mousemove 事件不需要 mousestart 先触发

```js
// 在 mousedown 的回调中添加对 mousemove 和 mouseup 事件的监听
elem.addEventListener('mousedown', event => {
  let move = function(event){ };
  let up = function(event){ };
  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
});

// 而 touchmove 不需要像 mouse 事件一样
elem.addEventListener('touchstart', event => { });
elem.addEventListener('touchmove', event => { });
elem.addEventListener('touchend', event => { })
elem.addEventListener('touchcancel', event => { })
```

#### 事件标识

##### Web 端

mousedown 和 mouseup 通过 `event.button`来标识

- `0` - 鼠标左键

- `1` - 鼠标滚轮或者是中键

- `2` - 鼠标右键

mousemove 没有 event.button 属性，因为不按下任何键也可以触发 mousemove 事件

event.buttons 表示哪些键被按下了

- `0 ` : 没有按键或者是没有初始化
- `1 ` : 鼠标左键
- `2 ` : 鼠标右键
- `4 ` : 鼠标滚轮或者是中键

为了使事件标识可以对应上，需要进行位操作

```
1 << event.button
```

- `1` - 鼠标左键

- `2` - 鼠标滚轮或者是中键

- `4` - 鼠标右键

**注意：event.button 与 event.buttons 中中键和右键顺序不同，需要特殊处理一下**

##### 移动端

`event.changedTouches`中每个 touch 对象中都有一个 `identifier`来唯一标识触摸点

##### 判断 web 端还是移动端

因为移动端可以响应 mousedown 事件，会导致 tap 事件响应两次，所以要区分 web 端还是移动端，分别监听 mouse 事件和 touch 事件

### 封装

手势库可拆分为几部分

Gesture -> Listener -> Recognizer -> Dispatcher

Gesture: 统一事件监听

Listener: 监听 mouse 和 touch 事件

Recognizer: 判断事件类型和触发时机

Dispatcher: 派发事件

更多的封装需要参考业内成熟的手势库