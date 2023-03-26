const {connectDB} = require('../config.js');
const main = require("../main.js");
const producto = require("../models/producto.js")
const logger = require ('../utils/logger.js')

module.exports = class Contenedor {
    constructor(model) {
        this.model = model
    }
    async getAll() {
        try {
            connectDB();
            const data = await this.model.find({});
            return data;
        } catch (error) {
            logger.error(error)
        }
    }

    async getById(id) {
        try {
            connectDB();
            const data = await this.model.find({ id: id });
            if (data.length == 0) {
                return { error: "elemento no encontrado" };
            } else {
                return data[0];
            }
        } catch (error) {
            logger.error(error)
        }
    }

    async saveProduct(object) {
        if ((await main.isAdmin(main.userLogged)) == true || await main.isAdmin(main.userLogged) == "true") {
            try {
                await connectDB();
                const data = await this.model.find({});
                const ids = data.map((producto) => producto.id);
                const idMaximo = Math.max(...ids);
                if (!object.nombre) {
                    return {
                        error: "no se agregó un nombre. el producto no fue guardado"
                    };
                } else if (!object.precio) {
                    return { error: "atención, no se ha introducido un precio" };
                } else if (!object.codigo) {
                    return { error: "atención, no se ha introducido un codigo" };
                } else if (!object.thumbnail) {
                    return { error: "atención, no se ha introducido un thumbnail" };
                } else if (!object.stock) {
                    return { error: "atención, no se ha introducido un stock" };
                } else if (!object.detalle) {
                    return { error: "atención, no se ha introducido un detalle" };
                } else if (idMaximo == -Infinity) {
                    object.id = 1;
                    object.timestamp = Date.now();
                    await this.model.create(object)
                    return null;
                } else {
                    const idMaximo = Math.max(...ids);
                    object.id = idMaximo + 1;
                    object.timestamp = Date.now();
                    await this.model.create(object)
                    return object;
                }
            } catch (error) {
                logger.error("error!: ", error);
            }
        } else {
            return { error: -1, descripcion: "ruta / metodo POST no autorizado" };
        }
    }

    async updateProduct(object, id) {
        if (await main.isAdmin(main.userLogged) == true || await main.isAdmin(main.userLogged) == "true") {
            try {
                await connectDB();
                const data = await this.model.find({ id: id });
                if (data.length == 0) {
                    return { error: "producto no encontrado" };
                } else if (!object.nombre) {
                    return { error: "atención, no se ha introducido un nombre" };
                } else if (!object.precio) {
                    return { error: "atención, no se ha introducido un precio" };
                } else if (!object.codigo) {
                    return { error: "atención, no se ha introducido un codigo" };
                } else if (!object.thumbnail) {
                    return { error: "atención, no se ha introducido un thumbnail" };
                } else if (!object.stock) {
                    return { error: "atención, no se ha introducido un stock" };
                } else if (!object.detalle) {
                    return { error: "atención, no se ha introducido un detalle" };
                } else {
                    object.id = id;
                    object.timestamp = data.timestamp;
                    await this.model.updateOne({ id: id },
                        {
                            $set:
                            {
                                "nombre": object.nombre,
                                "precio": object.precio,
                                "codigo": object.codigo,
                                "thumbnail": object.thumbnail,
                                "stock": object.stock,
                                "detalle": object.detalle
                            }
                        })
                }
            } catch (error) {
                logger.error("error!: ", error);
            }
        } else {
            return { error: -1, descripcion: "ruta / metodo PUT no autorizado" };
        }
    }

    async deleteById(id) {
        if ((await main.isAdmin(main.userLogged)) == true || await main.isAdmin(main.userLogged) == "true") {
            try {
                await connectDB();
                const data = await this.model.find({ id: id });
                if (data.length == 0) {
                    return { error: "producto no encontrado" };
                } else {
                    await this.model.deleteOne({ id: id })
                }
            } catch (error) {
                logger.error("error!: ", error);
            }
        } else {
            return { error: -1, descripcion: "ruta / metodo DELETE no autorizado" };
        }
    }

    //apartado específico para el carrito

    async getCartById(id) {
        try {
            await connectDB();
            const data = await this.model.find({ id: id }, {"productos": 1, "_id": 0 });
            if (data.length == 0) {
                return { error: "usuario no encontrado" };
            } else {
                return data[0].productos;
            }
        } catch (error) {
            logger.error(error)
        }
    }

    async saveCart() {
        await connectDB();
        if (await this.cartFinder(main.userLogged) == 0) {
            this.newCart(main.userLogged, []);
            return { id: main.userLogged };
        } else {
            return { alerta: "el carrito con id " + main.userLogged + " ya existe" };
        }
    }

    async deleteCart(id) {
        const idParsed = parseInt(id)
        await connectDB();
        if (await this.cartFinder(main.userLogged).length == 0) {
            return { error: "carrito no encontrado" };
        } else {
            try {
                await this.model.deleteOne({ id: idParsed });
            } catch (error) {
                logger.error(error);
            }
        }
    }

    async addToCart(id, cant) {
        await connectDB();
        const item = await producto.find({ id: id });
        if (main.userLogged == 0) {
            return {
                error:
                    "no hay un usuario logueado.",
            };
        } else if (item.length == 0) {
            return {
                error:
                    "el producto no se encuentra en la base de datos, no se puede agregar",
            };
        } else if (cant == undefined) {
            return {
                alerta: "no se ha especificado ninguna cantidad de items a cargar",
            };
        } else if (await this.cartFinder(main.userLogged) == 0) {
            const productoAnadido = this.productBuilder(item[0], cant);
            await this.newCart(main.userLogged, [productoAnadido]);
            return {
                alerta:
                    "el carrito del usuario no existía, se ha creado uno en su lugar con el producto solicitado",
            };
        } else {
            const productoAnadido = this.productBuilder(item[0], cant);
            if (await this.productExistence(id) == 0) {
                await this.model.updateOne({ "id": main.userLogged }, { $addToSet: { productos: productoAnadido } })
            } else {
                const query = { id: main.userLogged, "productos.id": parseInt(id)};
                const updateDocument = {
                    $set: { "productos.$.stock": parseInt(cant)}
                };
                await this.model.updateOne(query, updateDocument)
            }
        }
    }

    async deleteFromCart(idUser, idProd) {
        await connectDB();
        const idUsrParsed = parseInt(idUser)
        const idPrdParsed = parseInt(idProd)
        if (await this.cartFinder(idUser) == 0) {
            return { error: "carrito no encontrado" };
        } else if (await this.productExistence(idPrdParsed) == 0) {
            return { error: "producto no encontrado"};
        } else {
            await this.model.updateOne({ "id": idUsrParsed }, { $pull: { productos: { id: idPrdParsed } } })
        }
    }

    // funciones complementarias (evitan redundancia de codigo)

    productBuilder(source, cant) {
        const producto = {
            id: source.id,
            timestamp: source.timestamp,
            nombre: source.nombre,
            detalle: source.detalle,
            codigo: source.codigo,
            thumbnail: source.thumbnail,
            precio: source.precio,
            stock: cant,
        };
        return producto;
    }

    async newCart(id, products) {
        await connectDB();
        const cart = { id: id, timestamp: Date.now(), productos: products };
        await this.model.create(cart)
    }

    async cartFinder(id) {
        await connectDB();
        const data = await this.model.find({ id: id });
        return data.length;
    }

    async productExistence(id) {
        await connectDB();
        const idParsed = parseInt(id)
        const result = await this.model.find({ $and: [{ "id": main.userLogged}, { "productos.id": idParsed }]})
        return result.length
    }
}