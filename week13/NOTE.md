## 学习笔记

### CSS 动画 vs JS 动画

JS 动画可以更精细灵活的控制动画的细节，如暂停动画，恢复动画等

### JS 动画

- 实现
  - setInterval
  - setTimeout
    - 以上两个不建议使用
      - 动画间隔不准
      - 动画堆积（比如回调执行时间过长）
  - requestAnimationFrame
    - 按浏览器刷新频率绘制，动画更流畅
- 封装
  - Timeline 类
    - 对动画节点进行控制
      - start
      - pause
      - resume
      - reset
  - Animation 类
    - 对构成动画的属性进行设置
      - 对象以及动画属性
      - 开始值
      - 结束值
      - 动画时间
      - 延迟时间
      - 缓动函数
      - 开始值和结束值的包装函数