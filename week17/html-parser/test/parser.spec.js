import assert from 'assert';
import parserHTML from '../src/parser';


describe('html parser cases', function(){
  it('<a></a>', function(){
    const tree = parserHTML('<a></a>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<a href="https://www.baidu.com"></a>', function(){
    const tree = parserHTML('<a href="https://www.baidu.com"></a>');
    assert.strictEqual(tree.children[0].attributes.length, 1);
    assert.strictEqual(tree.children[0].attributes[0].name, "href");
    assert.strictEqual(tree.children[0].attributes[0].value, "https://www.baidu.com");
  });
  it('<a href=\'https://www.baidu.com\'></a>', function(){
    const tree = parserHTML('<a href=\'https://www.baidu.com\'></a>');
    assert.strictEqual(tree.children[0].attributes.length, 1);
    assert.strictEqual(tree.children[0].attributes[0].name, "href");
    assert.strictEqual(tree.children[0].attributes[0].value, "https://www.baidu.com");
  });
  it('<br/>', function(){
    const tree = parserHTML('<br/>');
    assert.strictEqual(tree.children[0].tagName, 'br');
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<BR />', function(){
    const tree = parserHTML('<BR />');
    assert.strictEqual(tree.children[0].tagName, 'BR');
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<img src="xxx"/>', function(){
    const tree = parserHTML('<img src="xxx"/>');
    assert.strictEqual(tree.children[0].tagName, 'img');
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<a disabled></a>', function(){
    const tree = parserHTML('<a disabled></a>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<a href="https://www.baidu.com" disabled></a>', function(){
    const tree = parserHTML('<a href="https://www.baidu.com" disabled></a>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].children.length, 0);
    assert.strictEqual(tree.children[0].attributes.length, 2);
  });
  it('<a disabled=true></a>', function(){
    const tree = parserHTML('<a disabled=true></a>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].children.length, 0);
    assert.strictEqual(tree.children[0].attributes.length, 1);
    assert.strictEqual(tree.children[0].attributes[0].name, "disabled");
    assert.strictEqual(tree.children[0].attributes[0].value, "true");
  });
  it('<a disabled = true/>', function(){
    const tree = parserHTML('<a disabled = true/>');
    assert.strictEqual(tree.children[0].tagName, 'a');
    assert.strictEqual(tree.children[0].children.length, 0);
  });
  it('<>', function(){
    const tree = parserHTML('<>');
    assert.strictEqual(tree.children.length, 1);
    assert.strictEqual(tree.children[0].type, 'text');
  });
  it('<a disabled href="https://www.baidu.com"></a>', function(){
    const tree = parserHTML('<a disabled href="https://www.baidu.com"></a>');
    assert.strictEqual(tree.children[0].attributes.length, 2);
  });
})

