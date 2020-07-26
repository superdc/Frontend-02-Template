/**
 * find string 'ab'
 * @param {*} string
 */
function matchString(str){
  let foundA = false;
  for(let s of str){
    if(s === 'a'){
      foundA = true;
    }else if(foundA && s === 'b'){
      return true;
    }else {
      foundA = false;
    }
  }
  return false;
}

matchString('anaamabdab'); // true
