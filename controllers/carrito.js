const {cartDao} = require ('../daos/DaoGeneral.js')

//class file system
const Carrito = require("../classes/carrito.js");
const shopCart = new Carrito("./db/carrito.txt");

//carrito
async function listAll(req, res) {
 const resultado = await cartDao.listAll();
  return res.send(resultado);
};

async function listById(req, res) {
  const resultado = await cartDao.listById(req.params.id);
  return res.send(resultado);
}

async function createCart(req, res) {
  const resultado = await cartDao.createCart();
  return res.send(resultado);
}

async function addProduct(req, res) {
  const resultado = await cartDao.updateCart(req.params.id, req.body.cantidad);
  return res.send(resultado);
}

async function deleteCart(req, res) {
  const resultado = await cartDao.removeCart(req.params.id);
  return res.send(resultado);
}

async function removeProductById(req, res) {
  const resultado = await cartDao.removeProduct(req.params.id, req.params.id_prod);
  return res.send(resultado);
}

module.exports = { listAll, listById, createCart, addProduct, deleteCart, removeProductById }