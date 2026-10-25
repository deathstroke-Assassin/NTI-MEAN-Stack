console.log("hiiiii");
// const calculate = require("./opSum");   // COMMONJS object containing all the functions in opSum.js THAT ARE INCLUDED IN( MODULE.EXPORTS)
import calculate from "./opSum.js"      // using MODULE type
import {divide} from "./opSum.js"      // using MODULE type exporting the method itself not the whole objects in export default


let res= calculate.summation(4,2)   //summation is the function name in opSum.js file so it is called using .summation
console.log(res);

res= calculate.subtract(1,3)    //summation is the function name in opSum.js file so it is called using .subtract
console.log(res);

res = divide(10,3)      // calling the method directly not from the file not the object (calculate)
console.log(res);
