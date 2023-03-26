const adminFirebase = require('firebase-admin');
const main = require("../main.js");
const FieldValue = require('firebase-admin').firestore.FieldValue
const db = adminFirebase.firestore();
const logger = require ('../utils/logger.js')

module.exports = class Contenedor {
    constructor(collection) {
        this.collection = collection
    }

    async getAll() {
        const query = db.collection(this.collection)
        try {
            const querySnapShot = await query.get()
            let docs = querySnapShot.docs;
            const data = docs.map((doc) => ({
                id: parseInt(doc.id),
                nombre: doc.data().nombre,
                precio: doc.data().precio,
                codigo: doc.data().codigo,
                thumbnail: doc.data().thumbnail,
                stock: doc.data().stock,
                detalle: doc.data().detalle,
                timestamp: doc.data().timestamp
            }))
            return (data)
        } catch (error) {
            logger.error(error)
        }
    }

    async getById(id) {
        const query = db.collection(this.collection)
        try {
            const doc = query.doc(`${id}`)
            const item = await doc.get()
            const data = item.data()
            return data
        } catch (error) {
            logger.error(error)
        }
    }

    async saveProduct(object) {
        const query = db.collection(this.collection)
        if ((await main.isAdmin(main.userLogged)) == true || await main.isAdmin(main.userLogged) == "true") {
            try {
                const data = await this.getAll()
                const ids = data.map((producto) => producto.id);
                const idMaximo = Math.max(...ids);
                if (!object.nombre) {
                    return { error: "no se agregó un nombre. el producto no fue guardado" };
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
                    let doc = query.doc(`${object.id}`)
                    await doc.create(object)
                    return null
                } else {
                    object.id = idMaximo + 1 ;
                    object.timestamp = Date.now();
                    let doc = query.doc(`${object.id}`)
                    await doc.create(object)
                    return object
                }
            } catch (error) {
                logger.error(error)
            }
        } else {
            return { error: -1, descripcion: "ruta / metodo POST no autorizado" };
        }
    }

    async updateProduct(object, id) {
        const query = db.collection(this.collection)
        if (await main.isAdmin(main.userLogged) == true || await main.isAdmin(main.userLogged) == "true") {
            try {
                const data = await this.getById(id)
                if (data == undefined) {
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
                    object.id = id
                    object.timestamp = data.timestamp;
                    let doc = query.doc(`${object.id}`)
                    await doc.update(object)
                }
            } catch (error) {
                logger.error(error)
            }
        } else {
            return { error: -1, descripcion: "ruta / metodo PUT no autorizado" };
        }
    }

    async deleteById(id) {
        const query = db.collection(this.collection)
        if ((await main.isAdmin(main.userLogged)) == true || await main.isAdmin(main.userLogged) == "true") {
            try {
                const data = await this.getById(id)
                if (data == undefined) {
                    return { error: "producto no encontrado" };
                } else {
                    let doc = query.doc(`${id}`)
                    await doc.delete()
                }
            } catch (error) {
                logger.error(error)
            }
        } else {
            return { error: -1, descripcion: "ruta / metodo DELETE no autorizado" };
        }
    }

//apartado específico para el carrito

    async getAllCarts() {
        const query = db.collection(this.collection)
        try {
            const querySnapShot = await query.get()
            let docs = querySnapShot.docs;
            const data = docs.map((doc) => ({
                id: doc.id,
                timestamp: doc.data().timestamp,
                productos: doc.data().productos
            }))
            return (data)
        } catch (error) {
            logger.error(error)
        }
    }

    async getCartById(id) {
        const query = db.collection(this.collection)
        try {
            const doc = query.doc(`${id}`)
            const item = await doc.get()
            const data = item.data()
            if (data == undefined) {
                return { error: "usuario no encontrado" }
            } else {
                const item = await doc.get()
                const data = item.data().productos
                return data
            }
        } catch (error) {
            logger.error(error)
        }
    }

    async saveCart() {
        const query = db.collection(this.collection)
        try {
            const doc = query.doc(`${main.userLogged}`)
            const item = await doc.get()
            const data = item.data()
            if (data == undefined) {
                this.newCart(main.userLogged, [])
                return { id: main.userLogged }
            } else {
                return { alerta: "el carrito con id " + main.userLogged + " ya existe" };
            }
        } catch (error) {
            logger.error(error)
        }
    }

    async deleteCart(id) {
        const query = db.collection(this.collection)
        try {
            const data = await this.getById(id)
            if (data == undefined) {
                logger.error("error: carrito no encontrado")
                return { error: "carrito no encontrado" };
            } else {
                let doc = query.doc(`${id}`)
                await doc.delete()
                return null
            }
        } catch (error) {
            logger.error(error)
        }
    }

    async addToCart(id, cant) {

        const queryProds = db.collection("productos")
        const docFind = queryProds.doc(`${id}`)
        const itemFind = await docFind.get()
        const dataFind = itemFind.data()
        const query = db.collection(this.collection)
        const doc = query.doc(`${main.userLogged}`)
        const user = await doc.get()
        const findCart = user.data()
        if (main.userLogged == 0) {
            return { error: "no hay un usuario logueado." }
        } else if (dataFind == undefined) {
            return { error: "el producto no se encuentra en la base de datos, no se puede agregar." }
        } else if (cant == undefined) {
            logger.warn("no hay cantidad")
            return { error: "no se ha especificado ninguna cantidad de items a cargar." }
        } else if (findCart == undefined) {
            const productoanadido = this.productBuilder(dataFind, cant)
            this.newCart(main.userLogged, [productoanadido])
            return {
                alerta:
                    "el carrito del usuario no existía, se ha creado uno en su lugar con el producto solicitado",
            };
        } else {
            const productoanadido = this.productBuilder(dataFind, cant)
            if (await this.productExistence(id) == -1) {
                await db.collection(`${this.collection}`).doc(`${main.userLogged}`)
                    .update('productos', FieldValue.arrayUnion(productoanadido), { merge: true })
            } else {
                const eraser = await findCart.productos[await this.productExistence(id)]
                await db.collection(`${this.collection}`).doc(`${main.userLogged}`)
                    .update('productos', FieldValue.arrayRemove(eraser))
                await db.collection(`${this.collection}`).doc(`${main.userLogged}`)
                    .update('productos', FieldValue.arrayUnion(productoanadido), { merge: true })
            }
        }
    }

    async deleteFromCart(idUser, idProd) {
        const query = db.collection(this.collection)
        const doc = query.doc(`${idUser}`)
        const item = await doc.get()
        const data = item.data()
        if (data == undefined) {
            return { error: "carrito no encontrado." };
        } else if (await await this.productExistence(idProd) == -1) {
            return { error: "producto no encontrado." };
        } else {
            const eraser = await data.productos[await this.productExistence(idProd)]
            await db.collection(`${this.collection}`).doc(`${main.userLogged}`)
                .update('productos', FieldValue.arrayRemove(eraser))
        }
    }

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
        const query = db.collection(this.collection)
        const cart = { id: id, timestamp: Date.now(), productos: products };
        let doc = query.doc(`${id}`)
        await doc.create(cart)
    }
    async productExistence(id) {
        const data = await this.getCartById(main.userLogged)
        const result = await data.findIndex((producto) => producto.id == id)
        return result
    }

}