const products = [
  { id: 1, name: "Laptop", price: 1200, category: "electronics" },
  { id: 2, name: "Phone", price: 800, category: "electronics" },
  { id: 3, name: "Book", price: 30, category: "education" },
  { id: 4, name: "Monitor", price: 400, category: "electronics" },
  { id: 4, name: "Monitor", price: 100, category: "electronics" },
  { id: 5, name: "Pen", price: 5, category: "education" }
];


// minPrice= products[0]
// for (let index = 1; index < products.length; index++) {
//     if (products[index].price < products[index + 1].price ) {
//         minPrice= products[index]
//     }
// }
// console.log(products[index].price);

//

minPrice= products[0].price
minIndex=0;
for (let index = 1; index < products.length; index++) {
    if (products[index].price < minPrice ) {
        minPrice= products[index].price;
        minIndex= index;
    }
}
console.log(products[minIndex]);

     //=======\\
    //=========\\
   //===========\\
  //=============\\
 //===============\\
//=================\\
product= products[0];
for (let index = 0; index < products.length; index++) {
    if (products[index].price < product.price) {
        product= products[index]
    }
    
}
console.log(product);
//===================