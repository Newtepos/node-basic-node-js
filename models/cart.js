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
      const productCartIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const exisitingProduct = cart.products[productCartIndex];
      let updatedProduct;
      if (exisitingProduct) {
        updatedProduct = { ...exisitingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products[productCartIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, price) {
    //Fetch Current Cart
    fs.readFile(p, (err, fileContent) => {
      const { products, totalPrice } = JSON.parse(fileContent);
      const product = products.find((prod) => prod.id === id);
      if (product) {
        const productQty = product.quantity;
        const updatedProduct = products.filter((prod) => prod.id !== id);
        const updatetTotalPrice = totalPrice - productQty * price;
        fs.writeFile(
          p,
          JSON.stringify({
            products: updatedProduct,
            totalPrice: updatetTotalPrice,
          }),
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  static getCart(cb) {
    //fetch Previous Cart
    fs.readFile(p, (err, fileContent) => {
      const Cart = JSON.parse(fileContent);
      cb(Cart)
    });
  }
};
