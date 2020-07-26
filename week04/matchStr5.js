/** 
 * 状态机，'abababx'
*/

function matchString(str){
  str = str || '';
  let state = start;
  for(let s of str){
    state = state(s);
  }
  return state === end;
}

function start(s){
  if(s === 'a'){
    return foundA;
  }
  return start;
}

function foundA(s){
  if(s === 'b'){
    return foundB;
  }
  return start(s);
}

function foundB(s){
  if(s === 'a'){
    return foundA2;
  }
  return start(s);
}

function foundA2(s){
  if(s === 'b'){
    return foundB2;
  }
  return start(s);
}

function foundB2(s){
  if(s === 'a'){
    return foundA3;
  }
  return foundB(s);
}

function foundA3(s){
  if(s === 'b'){
    return foundC;
  }
  return start(s);
}

function foundC(s){
  if(s === 'x'){
    return end;
  }
  return foundB2(s);
}

function end(){
  return end;
}

console.log(matchString('ababababx'));
