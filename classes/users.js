const fs = require("fs");
const main = require("../main.js");
const logger = require ('../utils/logger.js')

module.exports = class Users {
  constructor(archivo) {
    this.archivo = archivo;
  }

  userLogged(object) {
    main.userLogged = object.id
    return { exito: `usuario ${object.id} activo` };
  }

  async getAll() {
    await main.fileChecker(this.archivo);
    try {
      const file = await fs.promises.readFile(this.archivo, "utf-8");
      const data = JSON.parse(file);
      return data;
    } catch (error) {
      logger.error("error!: ", error);
    }
  }
  async getById(id) {
    await main.fileChecker(this.archivo);
    try {
      const file = await fs.promises.readFile(this.archivo, "utf-8");
      const data = JSON.parse(file);
      const index = data.findIndex((usuario) => usuario.id == id);
      return data[index] || { error: "usuario no encontrado" };
    } catch (error) {
      logger.error("error!: ", error);
    }
  }
  async save(object) {
    await main.fileChecker(this.archivo);
    try {
      const agregar = object;
      const file = await fs.promises.readFile(this.archivo, "utf-8");
      const data = JSON.parse(file);
      const ids = data.map((usuario) => usuario.id);
      const idMaximo = Math.max(...ids);
      if (!object.nombre) {
        return {
          error: "no se agregó un nombre. el usuario no fue guardado",
        };
      } else if (!object.apellido) {
        return {
          error: "no se agregó un apellido. el usuario no fue guardado",
        };
      } else if (!object.email) {
        return {
          error:
            "no se agregó un nombre de e-mail. el usuario no fue guardado",
        };
      } else if (!object.usuario) {
        return {
          error:
            "no se agregó un nombre de usuario. el usuario no fue guardado",
        };
      } else if (!object.contrasena) {
        return {
          error: "no se agregó una contraseña. el usuario no fue guardado",
        };
      } else if (!object.admin) {
        return {
          error:
            "el tipo de usuario no está definido. el usuario no fue guardado",
        };
      } else if (idMaximo == -Infinity) {
        agregar.id = 1;
        data.push(agregar);
        await fs.promises.writeFile(
          this.archivo,
          JSON.stringify(data, null, 2)
        );
        return agregar;
      } else {
        const idMaximo = Math.max(...ids);
        agregar.id = idMaximo + 1;
        data.push(agregar);
        await fs.promises.writeFile(
          this.archivo,
          JSON.stringify(data, null, 2)
        );
        return agregar;
      }
    } catch (error) {
      logger.error("error!: ", error);
    }
  }
  async update(object, id) {
    await main.fileChecker(this.archivo);
    try {
      const file = await fs.promises.readFile(this.archivo, "utf-8");
      const data = JSON.parse(file);
      const index = data.findIndex((usuario) => usuario.id == id);
      if (index == -1) {
        return { error: "usuario no encontrado" };
      } else if (!object.nombre) {
        return { error: "atención, no se ha introducido un nombre" };
      } else if (!object.apellido) {
        return {
          error: "no se agregó un apellido. el usuario no fue guardado",
        };
      } else if (!object.email) {
        return {
          error:
            "no se agregó un nombre de e-mail. el usuario no fue guardado",
        };
      } else if (!object.usuario) {
        return {
          error:
            "no se agregó un nombre de usuario. el usuario no fue guardado",
        };
      } else if (!object.contrasena) {
        return {
          error: "no se agregó una contraseña. el usuario no fue guardado",
        };
      } else if (!object.admin) {
        return {
          error:
            "el tipo de usuario no está definido. el usuario no fue guardado",
        };
      } else {
        object.id = data[index].id;
        data.splice(index, 1, object);
        await fs.promises.writeFile(
          this.archivo,
          JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      logger.error("error!: ", error);
    }
  }
  async deleteById(id) {
    await main.fileChecker(this.archivo);
    try {
      const file = await fs.promises.readFile(this.archivo, "utf-8");
      const data = JSON.parse(file);
      const index = data.findIndex((usuario) => usuario.id == id);
      if (index == -1) {
        return { error: "usuario no encontrado" };
      } else {
        data.splice(index, 1);
        await fs.promises.writeFile(
          this.archivo,
          JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      logger.error("error!: ", error);
    }
  }
};
