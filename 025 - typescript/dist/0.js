"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let x = 10;
console.log(x);
var Direction;
(function (Direction) {
    Direction[Direction["Left"] = 0] = "Left";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Up"] = 2] = "Up";
    Direction[Direction["Down"] = 3] = "Down";
})(Direction || (Direction = {}));
let move = Direction.Up;
console.log(move, 'the index of it');
let age = 23;
// age = "22"  //error
// if the function returns nothing then use :void
//# sourceMappingURL=0.js.map