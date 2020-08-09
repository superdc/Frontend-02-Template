## 学习笔记

本周从 CSS 标准出发，学习了 CSS 的语法，规则及选择器知识。

## CSS 规则

见 xmind

## CSS 选择器

### 优先级

把 css 选择器优先级表示为一个四元组arr = [inline, id, class, type]

优先级从高到低依次为：

1. arr[0]: 元素内联样式
2. arr[1]: id 选择器
3. arr[2]: 类/伪类/属性选择器
4. arr[3]: 类型/伪元素选择器

注意：

:not(selectors) 优先级计算方式：selectors 优先级按照上述规则计算，:not() 选择器的优先级忽略不计

### 伪元素 ::first-line, ::first-letter

可用属性

![image](https://user-images.githubusercontent.com/8255083/89701739-5ee54300-d96c-11ea-9c16-76a65b32be92.png)

### 思考题：

为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

因为 CSS 产生是为了文字排版，那么元素可以设置的 CSS 样式规则也是为排版服务的，满足现实中的排版需求。float 产生的最初目的是为了实现文字环绕效果。first-letter 可以选取首字母，float 恰好可以实现文字环绕的效果，为了排版的美观，可以设置盒模型相关的样式属性。而 first-line 设置 float 之类的属性则会破坏排版，所以不支持。
