## 学习笔记

### 单元测试

#### 应用场景

工具函数，组件库等非一次性业务代码的场景，可以写单元测试来保证代码的稳定性

#### 工具

测试框架：mocha （看 npm trends 的数据，jest 的下载量已经远超过 mocha 了）

断言库：assert（也可以使用其他风格的断言库）

测试覆盖率：nyc (istanbul 的命令行工具，配合 mocha 使用)

#### 一些注意项

1. mocha 默认不支持 import 语法

   使用 babel 将代码转为 es5 语法或者使用 @babel/register 即时编译

2. 运行 mocha 会自动执行 test 目录下的文件

3. nyc 

   对于使用 Babel 的项目，需要配置插件

   ```json
   // .babelrc
   {
     "plugins": [ "istanbul" ]
   }
   // .nycrc
   {
       "extends": "@istanbuljs/nyc-config-babel"
   }
   ```

4. vscode 调试

   需要多了解一下 vscode 调试的方法

   - runtimeArgs 可以对调用的命令加参数
   - 由于代码经过了 babel 的转译，可以通过开启 sourceMap 定位源码位置