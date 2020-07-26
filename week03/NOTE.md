## 学习总结

这周主要从规范的角度了解了 JavaScript 中运算符，表达式，语句，执行上下文，作用域链等概念。在做作业的过程中可以在 ECMA 规范中查找相应的概念，对规范没有那么抵触的感觉了。

### Realms

#### What

Conceptually, a realm consists of a set of intrinsic objects, an ECMAScript global environment, all of the ECMAScript code that is loaded within the scope of that global environment, and other associated state and resources.

Realm 由一系列固有对象，ECMAScript 全局环境，全局环境中加载的 ECMASCript 代码以及其他相关的状态和资源。 

我的理解：Realm 可以看做一个隔离的环境，环境之间互不干扰。

#### How

[Realm 中 well-known 的内置对象](https://tc39.es/ecma262/#sec-well-known-intrinsic-objects)

获取全部内置对象：从 Global Object 中获取

[Global Object](https://tc39.es/ecma262/#sec-global-object) 的属性：

1. 值属性
   - globalThis
   - Inifinity
   - NaN
   - undefined
2. 函数属性
   - eval
   - isFinite
   - isNaN
   - parseFloat
   - parseInt
   - decodeURI
   - decodeURIComponent
   - encodeURI
   - encodeURIComponent
3. 构造器属性
   - Array
   - ArrayBuffer
   - BigInt
   - BigInt64Array
   - BigUint64Array
   - Boolean
   - DataView
   - Date
   - Error
   - EvalError
   - Float32Array
   - Float64Array
   - Function
   - Int8Array
   - Int16Array
   - Int32Array
   - Map
   - Number
   - Object
   - Promise
   - Proxy
   - RangeError
   - ReferenceError
   - RegExp
   - Set
   - SharedArrayBuffer
   - String
   - Symbol
   - SyntaxError
   - TypeError
   - Uint8Array
   - Uint8ClampedArray
   - Uint16Array
   - Uint32Array
   - URIError
   - WeakMap
   - WeakSet
4. 其他属性
   - Atomics
   - JSON
   - Math
   - Reflect

#### Why

为什么需要 Realm 呢？

[Motivation](https://github.com/tc39/proposal-realms/blob/main/explainer.md#motivations)

想到了微前端的场景，不同团队维护的代码在运行时是希望有个隔离的沙箱环境的，避免变量之间的冲突。

作业：https://codesandbox.io/s/jolly-diffie-5sbgp?file=/index.js


