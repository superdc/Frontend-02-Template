/**
 * find string 'abcdef'
 */

 function matchString(str, targetStr){
   str = str || '';
   const len = str.length;
   const targetStrLen = targetStr.length;
   for(let i=0; i< len; i++){
     const subStr = str.substring(i, targetStrLen + i);
     if(subStr === targetStr){
       return true;
     }
   }
   return false;
 }

 matchString('ababcdefab', 'abcdef')
