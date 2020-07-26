/** 
 * find string "a"
*/

function matchString(string){
  for(let str of string){
    if(str === 'a'){
      return true;
    }
  }
  return false;
}

matchString('bdsfdadfjdk');
