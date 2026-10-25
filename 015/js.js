// const greet = (name) => {
//     return "Hello " + name;
// };

// console.log(greet("Mohamed"));

// // shorter arrow function
// const arrow = (name)=> "hi there " + name;
// console.log(arrow("batata"));

// const arrow2 = (name= "guest")=> "hi there " + name;
// console.log(arrow2());

// function sum () {
//     console.log(...arguments);
// }
// sum(1,2,3)

// function sum(...numbers) {
//     return numbers.reduce((total, n) => total + n, 0);
// }

// console.log(sum(10, 20, 30)); // 60

// function calculate(op ="sum", ...numbers) {
//     if (op === "sum") {
//         return numbers.reduce((total, n) => total + n, 0);
//     }
//     if (op ==="multiple") {
//         return numbers.reduce((total, n) => total * n, 1);

//     }
// }

// console.log(calculate("sum", 1, 2, 3)); // 60
// console.log(calculate("multiple", 10, 20, 30,40)); // 60
// console.log(calculate( 10, 20, 30,40)); // 60

// function calculate(numbers, op ="sum") {
//     if (op === "sum") {
//         return numbers.reduce((total, n) => total + n, 0);
//     }
//     if (op ==="multiple") {
//         return numbers.reduce((total, n) => total * n, 1);

//     }
// }

// console.log(calculate( [1, 2, 3],"sum")); // 60
// console.log(calculate( [10, 20, 30,40],"multiple")); // 60
// console.log(calculate( [10, 20, 30,40])); // 60

// function multiply (a,b) {
//     return a* b
// }
// console.log(multiply(4,2));

// setTimeout(() => {
//     console.log("Done!");
// }, 2000);
// setInterval(()=>{
//     console.log("done now boy");
// },3000)

// =============
// counter =1
// const animToy = setInterval(()=>{
//     console.log("done "+ counter++);
//     if (counter >=5){
//         clearInterval(animToy)
//     }
// },2000)



// (
//     function (name) {
//   console.log("Hello " + name);
// }
// )
// ("Tamer Ali");



//chaining
// const user = {}
// console.log(user.adddress?.city);
//



// CLASSSSSSSSSSSSSSS
class User {
    constructor(userType, userInstitution, userTaxRate,userSalary){
        this.ownerType = userType
        this.ownerInstitutuin = userInstitution
        this.ownerTaxRate = userTaxRate
        this.ownerSalary = userSalary
    }
    hello(name) {
        console.log("hello "+ name);
    }

    netSalary() {
        return this.ownerSalary * (1 - this.ownerTaxRate)
    }
}


const student = new User("student", "school", 0, 1000);
const employee = new User("employ","company", 0.15, 5000);
student.hello("std")
console.log(student.netSalary());
employee.hello("emp")
console.log(employee.netSalary());
