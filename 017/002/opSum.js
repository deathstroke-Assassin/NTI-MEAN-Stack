const sum = (a, b) => {
  return a + b;
};

const substract = (a, b) => {
    return (a-b);
}



// module.exports ={       // commonjs type
//     "summation" : sum,
//     "subtract": substract
// }



export default{     // module type      will use this in upcoming sessions more
    "summation" : sum,
    "subtract": substract
}

export const divide = (a,b)=> {     // export the method directly not using the default way
    return (a / b)
}
