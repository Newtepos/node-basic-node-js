const e = require("express");
const fs = require("fs");
const path = require("path");
const Cart = require("../models/cart.js");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if(this.id) {
        const exisitngProductIndex = products.findIndex(prod => prod.id === this.id);
        const existingProducts = [...products];
        existingProducts[exisitngProductIndex] = this
        fs.writeFile(p, JSON.stringify(existingProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findProductbyId(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id == id);
      cb(product);
    });
  }

  static deleteProductById(id, cb) {
    getProductsFromFile((products) => {
      //delete Product Shop
      const filterdProduct = products.filter(prod => prod.id !== id) 
      fs.writeFile(p, JSON.stringify(filterdProduct), (err) => {
        console.log(err);
      });
      //delete Product in Cart
      const product = products.find(prod => prod.id === id)
      Cart.deleteProduct(id, product.price)
      cb(filterdProduct)
    })
  }
};
