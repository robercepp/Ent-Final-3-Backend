const ProductosMongo = require ('./productos/ProductosDaoMongoDb.js');
const CarritosMongo = require ('./carritos/CarritosDaoMongoDb.js');
const ProductosFirebase = require ('./productos/ProductosDaoFirebase.js');
const CarritosFirebase = require ('./carritos/CarritosDaoFirebase.js');
const ProductosFileSystem = require ('./productos/ProductosDaoFileSystem.js')
const CarritosFileSystem = require ('./carritos/CarritosDaoFileSystem.js')

const {persistenceType} = require('../config.js')

let productDao = null;
let cartDao = null;

if (persistenceType === "filesystem") {
  productDao = new ProductosFileSystem();
  cartDao = new CarritosFileSystem();
}

if (persistenceType === "mongo") {
  productDao = new ProductosMongo();
  cartDao = new CarritosMongo();
}

if (persistenceType === "firebase") {
    console.log("hola")
  productDao = new ProductosFirebase();
  cartDao = new CarritosFirebase();
}

module.exports = { productDao, cartDao }