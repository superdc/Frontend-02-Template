## 本周学习笔记

本周跟着老师完成了 toy-browser 的第一部分，把接收到的 HTML 构建成 DOM 树。

## 有限状态机（Finite-state machine, FSM）

### 应用场景

处理程序语言或自然语言的 tokenizer，自底向上解析语法的 parser，各种通信协议发送方和接收方传递数据等场景。

### 含义

表示在有限个状态以及在这些状态之间转移和动作等行为的计算模型。

- 每个状态都是一个机器
  - 在每个机器中，可以做计算、存储、输出等操作
  - 所有机器接收的输入是一致的
  - 每个机器本身没有状态（纯函数：输入一致，则输出保持一致，不会改变外部的变量等）
- 每个机器知道下一个状态
  - 每个机器都有确定的下一个状态（Moore）
  - 每个机器根据输入决定下一个状态（Mealy）

### 状态转移

- if ... else
- switch
- 函数 function

## HTTP 协议

### ISO-OSI 七层网络模型(开放式系统互联模型)

![image](https://user-images.githubusercontent.com/8255083/88479128-91139f80-cf7f-11ea-8246-c43d51f8b0e1.png)

### TCP

TCP 是一种面向连接的，可靠的，基于字节流的传输层通信协议。

关键词：

- 流
- 必须有端口
- 在 nodejs 中建立 TCP 连接使用 net 模块

### IP

用于分组交换数据的一种协议。根据源主机和目标主机的地址来传送数据。

关键词：

- 包
- ip 地址
- lipnet/libpcap

### HTTP

是客户端、服务器之间请求和应答的标准协议。

#### 请求报文

![image](https://user-images.githubusercontent.com/8255083/88479183-d932c200-cf7f-11ea-86ab-d70f009da55e.png)

注：

- 请求头和请求体中间有一个空行

- 每一行必须以回车(\r)换行(\n)结尾，空行内只能有\r\n而无其他空格

- 请求头中必须有 Host 字段，其他可选
- Content-Type 字段也是必须的，但在实现中会有默认值，所以也是可选。Content-Type 会影响 body 的格式

**请求行**

```
method path HTTP/1.1(协议版本)
```

常用请求方法：GET、POST、OPTIONS、HEAD

#### 响应报文

![image](https://user-images.githubusercontent.com/8255083/88479199-f9628100-cf7f-11ea-9036-e60d5d1be4b0.png)

注：

- 响应行和响应体之间有一个空行
- 每一行必须以回车(\r)换行(\n)结尾，空行内只能有\r\n而无其他空格
- NodeJS Transfer-Encoding 头部默认为 chunked，所以上图中响应体被数字分隔，表示这段响应体的长度（16进制表示）

**响应行**

```
HTTP/1.1(协议版本) 状态码 状态码描述
```

状态码：

- 1xx
- 2xx：请求成功
- 3xx：重定向
  - 301：永久重定向
  - 302：临时重定向
  - 304：用于协商缓存
- 4xx：客户端错误
- 5xx：服务器错误

## 浏览器原理概览

![image](https://user-images.githubusercontent.com/8255083/88479220-24e56b80-cf80-11ea-81c7-6ede76cbb598.png)

从浏览器地址栏输入 URL 后发生了什么？

1. 发送 HTTP 请求
2. 接收到响应 HTML 文件
3. 将 HTML 文件解析为 DOM 树
4. 计算 CSSOM 树
5. 结算节点位置，生成 layout 树
6. 渲染到屏幕上

### parse HTML

根据 [html 规范](https://html.spec.whatwg.org/multipage/parsing.html#tokenization) 创建状态机

- 处理标签
  - 开始标签
  - 结束标签
  - 自封闭标签
  - 标签结束状态提交标签 token
- 处理属性
  - 属性值：单引号，双引号，无引号
  - 属性结束时，将属性加到标签 token 上
- 处理文本节点
  - 多个文本节点需要合并
- 构建 DOM 树
  - 使用栈数据结构
  - 遇到开始标签创建元素并入栈，遇到结束标签出栈
  - 自封闭节点视为入栈后立即出栈
  - 任何元素的父元素是他入栈前的栈顶