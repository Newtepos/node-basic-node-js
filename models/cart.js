const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, price) {
    //fetch Previous Cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //Find Exisiting Product
      const productCartIndex = cart.products.findIndex(product => product.id === id)
      const exisitingProduct = cart.products[productCartIndex];
      let updatedProduct
      if(exisitingProduct) {
        updatedProduct = { ...exisitingProduct }
        updatedProduct.quantity = updatedProduct.quantity + 1
        cart.products[productCartIndex] = updatedProduct
      } else {
        updatedProduct = { id: id, quantity: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +price
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err)
      })
    });
  }
};
