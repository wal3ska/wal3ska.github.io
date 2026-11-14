import {newShell} from '../src/shell-core.mjs';
const b=newShell();
console.log(await b.exec('x=7; a=(one two); f(){ echo hi; }; mkdir abc; cd abc; declare -p; declare -f'));
console.log('paths',b.fs.getAllPaths().slice(0,30));
