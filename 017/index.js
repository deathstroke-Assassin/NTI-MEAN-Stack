// console.log("hello World!");
// console.log("hello Class!");
// console.log("hello nodemon!");

// blocking concept:

console.log("Hello, World!");

const fs = require('fs');

const data = fs.readFileSync("node.js.txt");

console.log("File has been read");

console.log("This runs after the file has been read");


// non-blocking concept:

// console.log("Hello, World!");
// const fs = require('fs');

// fs.readFile("node.js.txt", (err, data) => {
//     if (err) throw err;
//     console.log("File has been read FRom Async");
// });
// console.log("This runs while file is being read");

