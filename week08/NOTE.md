## 学习笔记

### DTD - Document Type Definition

作用：不属于 HTML 标签，是一条指令，用于告知浏览器文档所使用的 HTML 规范。

在 HTML5 之前，doctype 需要对 DTD 进行引用，因为他们是基于 SGML 和 XML 规范的。SGML 和 XML 规范的语法需要对 DTD 进行引用。而 HTML5 不再基于 SGML 规范，不需要对 DTD 进行引用，只需要像下面这样简单的写为：

```html
<!DOCTYPE HTML>
```

DTD 中定义了四项：

- 元素

- 属性

- 实体

  - ```html
    <!ENTITY nbsp   CDATA "&#160;" <!-- no-break space = non-breaking space,U+00A0 ISOnum -->
    <!ENTITY quot    "&#34;"> <!--  quotation mark, U+0022 ISOnum -->
    <!ENTITY amp     "&#38;#38;"> <!--  ampersand, U+0026 ISOnum -->
    <!ENTITY lt      "&#38;#60;"> <!--  less-than sign, U+003C ISOnum -->
    <!ENTITY gt      "&#62;"> <!--  greater-than sign, U+003E ISOnum -->
    ```

- 注释

### Namespace

HTML 文档中还可以包括 XML，SVG，MathML，命令空间可以使来自不同文档的相同元素或属性间没有冲突。

### HTML 中合法元素

- Element: <tagname>...</tagname>
- Text: text
- Comment: <!-- comments -->
- DocumentType: <!DOCTYPE HTML>
- ProcessingInstruction: <?a 1?>
- CDATA: <![CDATA[]]>
  - 是 XML 中的语法
  - CDATA 中的文本不会被处理，字符不会被转译，如`<`,`&`等字符
  - 用在 script 标签中，防止字符被转译。在 HTML 中没有任何意义，只是一种允许的语法，script 已经是 CDATA。

### DOM API

#### 导航类操作

|      node       |        element         |
| :-------------: | :--------------------: |
|   parentNode    |     parentElement      |
|   childNodes    |        children        |
|   firstChild    |   firstElementChild    |
|    lastChild    |    lastElementChild    |
|   nextSibling   |   nextElementSibling   |
| previousSibling | previousElementSibling |

parentNode 等价于 parentElement，因为只有 Element 类型的节点可以作为父节点

### 修改操作

- appendChild
- insertBefore
- removeChild
- replaceChild

#### 高级操作

- compareDocumentPosition
  - 比较两个节点中关系的函数

- contains
  - 检查一个节点是否包含另一个节点的函数
- isEqualNode
  - 检查两个节点是否完全相同
- isSameNode
  - 检查两个节点是否是同一个节点
- cloneNode
  - 拷贝一个节点。如果传入 true，则会联通子元素做深拷贝

### 事件 

[之前的总结](https://github.com/superdc/myBlogs/issues/6)

### Range API 

可以对节点进行更精细更强大的处理

Q: 将 DOM 节点倒序

#### 方法一：

```html
<div id="a">
	<span>1</span>
	<p>2</p>
	<a>3</a>
	<div>4</div>
</div>
<script>
	let element = document.getElementById('a');
	function reverseChild(elem){
		const l = elem.childNodes.length;
		while(l-- > 0){
			elem.appendChild(element.childNodes[l])
		}
	}
	reverseChild(element);
</script>
```

原理：

```js
1. 即时变化
// 返回值随 DOM 结构即时变化
document.getElementsByTagName - HTMLCollection(元素集合)
document.getElementsByClassName - HTMLCollection
document.getElementByName - HTMLCollection
elem.childNodes - NodeList（节点集合）
elem.children - HTMLCollection
// 非即时变化
parentNode.querySelectorAll - NodeList
2. appendChild
将一个节点附加到指定父节点的子节点列表的末尾。如果将被插入的节点已经存在与当前文档的文档树中，那么该方法只会讲它从原先的位置移到新的位置（不需要事先移除移动的节点）
```

#### 方法二：RangeAPI

```js
let range = new Range();
range.setStart(elem, 9);
range.setEnd(elem, 4);
range = document.getSelection().getRangeAt(0)
range.setStartBefore
range.setEndBefore
range.setStartAfter
range.setEndAfter
range.selectNode
range.selectNodeContents
range.extractContents -> fragment
range.insertNode
```

```html
<div id="a">
	<span>1</span>
	<p>2</p>
	<a>3</a>
	<div>4</div>
</div>
<script>
	let element = document.getElementById('a');
	function reverseChild(elem){
		let range = new Range()
    range.selectNodeContents(elem);// 对 fragment 进行不操作不会引起重排
    let fragment = range.extractContents()
    const l = fragment.childNodes.length
    while(l-- > 0){
      fragment.appenChild(fragment.childNodes[l])
    }
    elem.appendChild(fragment)
	}
	reverseChild(element);
</script>
```

### CSSOM

```
document.styleSheets
document.styleSheets[0].cssRules
document.styleSheets[0].insertRule
document.styleSheets[0].removeRule
window.getComputedStyle
```

### CSSOM View

```js
window.innerWidth, window.innerHeight
window.outerWidth, window.outerHeight
window.devicePixelRatio
window.screen
	.width .height
	.availWidth .availHeight
	
// window api
window.open
moveTo
moveBy
resizeTo
resizeBy

// scroll
scrollTop
scrollLeft
scrollWidth
scrollHeight
scroll(x,y)
scrollBy(x,y)
scrollIntoView()
window.scrollX
window.scrollY
window.scroll(x,y)
scrollBy(x,y)

// layout
getClientRects()
getBoundingClientRect()
```

### 其他 API

#### 标准化组织

- khronos
  - WebGL
- ECMA
  - ECMAScript
- WHATWG
  - HTML
- W3C
  - webaudio
  - CG/WG



