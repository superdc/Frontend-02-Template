## 学习笔记

### 持续集成

概念：频繁地将代码集成到主干

措施：在代码集成到主干之前进行一系列检查

#### 检查

- lint - 代码风格和语法校验
  - ESlint
  - StyleLint
- Puppeteer - Chrome 无头浏览器，对生成的页面进行一些规则的校验和检查

#### 检查时机

工具：Git hooks

#### Git hooks

在一个经过 `git init` 的仓库中可以看到 `.git` 文件夹，其下面有 `hooks` 文件夹，保存了 git 支持的 hooks 的实例脚本文件（以.sample 结尾，不可执行）

- applypatch-msg
- commit-msg
- post-update
- pre-applypatch
- pre-commit
- pre-push
- pre-rebase
- pre-receive
- prepare-commit-msg
- update

我们可以自定义上述钩子的可执行脚本（注：脚本的执行权限，可使用 `chmod +x ./pre-commit` 来为文件加上可执行权限，否则会 permission denied）

一般不会自己去定义这些钩子的内容吧，而是使用 husky 进行钩子的注册

#### ESLint

使用方式：

- API
  - 可以结合自定义的 git hooks 对文件进行检查
- 命令行
  - 可结合 husky 进行文件的检查

检查范围：

- 工程目录中符合条件的所有文件
  - 如果只想对要提交的文件进行检查（不包括本地未被跟踪的文件）该怎么做呢？
    - git stash
      - 但他会将所有的修改都保存起来，与要求不符
      - 使用 `git stash push -k` 文件可只讲本地未被跟踪的文件保存起来

#### Puppeteer

> Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 [DevTools](https://zhaoqize.github.io/puppeteer-api-zh_CN/(https://chromedevtools.github.io/devtools-protocol/)) 协议控制 Chromium 或 Chrome。

在浏览器中手动执行的绝大多数操作都可以使用 Puppeteer 完成

