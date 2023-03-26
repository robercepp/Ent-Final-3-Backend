const express = require ('express')
const router = express.Router()

//controllers requeridos
const cart = require('../controllers/carrito.js')

//rutas de carrito
router.get("/", cart.listAll);

router.get("/:id/productos", cart.listById);

router.post("/", cart.createCart);

router.post("/:id/productos", cart.addProduct);

router.delete("/:id", cart.deleteCart);

router.delete("/:id/productos/:id_prod", cart.removeProductById);

module.exports = router;