const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findProductbyId(productId, (product) => {
    res.render("shop/product-detail", {
      product,
      pageTitle: product.pageTitle,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const { products: cartProduct } = cart;
      const cartPreview = [];
      for (product of products) {
        const productCart = cartProduct.find((prod) => prod.id === product.id);
        if (productCart) {
          cartPreview.push({ product, quantity: productCart.quantity });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        cart: cartPreview,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findProductbyId(prodId, (product) => {
    Cart.addProduct(product.id, product.price);
  });
  res.redirect("/cart");
};

exports.postDeleteProductcCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findProductbyId(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
  });
  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
