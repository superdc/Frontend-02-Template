const { isBuffer } = require("util");

function getStyle(element){
  if(!element.style){
    element.style = {};
  }
  for(let prop in element.computedStyle){
    const p = element.computedStyle[prop];
    element.style[prop] = p.value;
    if(element.style[prop].toString().match(/px$/)){
      element.style[prop] = parseInt(element.style[prop]);
    }
    if(element.style[prop].toString().match(/^[0-9\.]+$/)){
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element){
  if(!element.computedStyle){
    return;
  }
  const elementStyle = getStyle(element);
  // 只处理 display: flex; 的情况
  if(elementStyle.display !== 'flex'){
    return;
  }
  const items = element.children.filter(child => child.type == 'element');
  // 支持 order 属性，按从小道大排列
  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });
  const style = elementStyle;
  ['width', 'height'].forEach( size => {
    if(style[size] === 'auto' || style[size] === ''){
      style[size] = null;
    }
  });
  if(!style.flexDirection || style.flexDirection === 'auto'){
    style.flexDirection = 'row';
  }
  if(!style.flexWrap || style.flexWrap === 'auto'){
    style.flexWrap = 'nowrap';
  } 
  if(!style.alignItems || style.alignItems === 'auto'){
    style.alignItems = 'stretch';
  }
  if(!style.justifyContent || style.justifyContent === 'auto'){
    style.justifyContent = 'flex-start';
  }
  if(!style.alignContent || style.alignContent === 'auto'){
    style.alignContent = 'stretch';
  }
  let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;
  if(style.flexDirection === 'row'){
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if(style.flexDirection === 'row-reverse'){
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if(style.flexDirection === 'column'){
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if(style.flexDirection === 'column-reverse'){
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = -1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if(style.flexWrap === 'wrap-reverse'){
    [crossStart, crossEnd] = [crossEnd, crossStart];
    crossSign = -1;
  }else{
    crossBase = 0;
    crossSign = 1;
  }

  let isAutoMainSize = false;
  if(!style[mainSize]){
    elementStyle[mainSize] = 0;
    items.forEach( item => {
      const itemStyle = getStyle(item);
      if(itemStyle[mainSize]){
        elementStyle[mainSize] += itemStyle[mainSize];
      }
    });
    isAutoMainSize = true;
  }

  let flexLine = [];
  let flexLines = [flexLine];
  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;
  items.forEach(item => {
    const itemStyle = getStyle(item);
    if(!itemStyle[mainSize]){
      itemStyle[mainSize] = 0;
    }
    if(itemStyle.flex){
      flexLine.push(item);
    }else if(style.flexWrap === 'nowrap' || isAutoMainSize){
      mainSpace -= itemStyle[mainSize];
      if(itemStyle[crossSize]){
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    }else{
      if(itemStyle[mainSize] > elementStyle[mainSize]){
        itemStyle[mainSize] = elementStyle[mainSize];
      }
      if(itemStyle[mainSize] > mainSpace){
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = elementStyle[mainSize];
        crossSpace = 0;
      }else{
        flexLine.push(item);
      }
      if(itemStyle[crossSize]){
        crossSpace = Math.max(crossSpace, itemStyle[crossSpace]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  })
  // 最后一行
  flexLine.mainSpace = mainSpace;
  if(elementStyle.flexWrap === 'nowrap' || isAutoMainSize){
    flexLine.crossSpace = (elementStyle[crossSize] !== undefined) ? elementStyle[crossSize] : crossSpace;
  }else{
    flexLine.crossSpace = crossSpace;
  }

  // 只在一行，nowrap 的情况
  if(mainSpace < 0){
    const scale = elementStyle[mainSize] / (elementStyle[mainSize] - mainSpace);
    let currentMain = mainBase;
    items.forEach(item => {
      const itemStyle = getStyle(item);
      if(!itemStyle.flex){
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = currentMain + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    })
  }else{// 多行情况
    flexLines.forEach(items => {
      const mainSpace = items.mainSpace;
      let flexTotal = 0;
      items.forEach(item => {
        const itemStyle = getStyle(item);
        if(itemStyle.flex){
          flexTotal += itemStyle.flex;
        }
      });
      if(flexTotal > 0){
        let currentMain = mainBase;
        items.forEach(item => {
          const itemStyle = getStyle(item);
          if(itemStyle.flex){
            itemStyle[mainSize] = mainSpace * (itemStyle.flex/flexTotal)
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = currentMain + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        })
      }else{
        let currentMain = 0;
        let step = 0;
        if(elementStyle.justifyContent === 'flex-start'){
          currentMain = mainBase;
        }else if(elementStyle.justifyContent === 'flex-end'){
          currentMain = mainSpace * mainSign + mainBase;
        }else if(elementStyle.justifyContent === 'center'){
          currentMain = mainBase + mainSpace / 2 * mainSign;
        }else if(elementStyle.justifyContent === 'space-between'){
          currentMain = mainBase;
          step = mainSpace / (items.length - 1) * mainSign;
        }else if(elementStyle.justifyContent === 'space-around'){
          step = mainSpace/item.length * mainSign
          currentMain = mainBase + step/2;
        }
        items.forEach(item => {
          const itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = currentMain + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        })
      }
    })
  }
  if(!elementStyle[crossSize]){
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    flexLines.forEach(items => {
      elementStyle[crossSize] += items.crossSpace;
    })
  }else{
    crossSpace = elementStyle[crossSize];
    flexLines.forEach(items => {
      crossSpace -= flexLine.crossSpace;
    })
  }
  if(style.flexWrap === 'wrap-reverse'){
    crossBase = style[crossSize];
  }else{
    crossBase = 0;
  }
  const lineSize = style[crossSize] / flexLines.length;
  let step = 0;
  if(style.alignContent === 'flex-start'){
    crossBase += 0;
  }
  if(style.alignContent === 'flex-end'){
    crossBase += crossSpace * crossSign;
  }
  if(style.alignContent === 'center'){
    crossBase += crossSpace * crossSign / 2;
  }
  if(style.alignContent === 'space-between'){
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }
  if(style.alignContent === 'space-around'){
    step = crossSpace / flexLines.length;
    crossBase += step/2 * crossSign;
  }
  if(style.alignContent === 'stretch'){
    crossBase += 0;
  }
  flexLines.forEach(items => {
    const lineCrossSize = style.alignContent === 'stretch' ? items.crossSpace + crossSpace/flexLines.length : items.crossSpace;
    items.forEach(item => {
      const itemStyle = getStyle(item);
      const align = style.alignItems || itemStyle.alignSelf;
      if(!itemStyle[crossSize]){
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
      }
      if(align === 'flex-start'){
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if(align === 'flex-end'){
        itemStyle[crossEnd] = lineCrossSize * crossSign + crossBase;
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }
      if(align === 'center'){
        itemStyle[crossStart] = crossBase + (lineCrossSize - itemStyle[crossSize])/2;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if(align === 'stretch'){
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * (itemStyle[crossSize]!==null && itemStyle[crossSize]!==(void 0)?itemStyle[crossSize]:lineCrossSize);
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    });
    crossBase += crossSign * (lineCrossSize + step);
  })
}

module.exports = layout;