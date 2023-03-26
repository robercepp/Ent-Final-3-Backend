const mongoose = require("mongoose");
const userModel = require("../models/userModel.js");
const bcript = require("bcryptjs");
const {enviarMail} = require ('../utils/mailer.js')
const logger = require ('../utils/logger.js')

module.exports = class UserHandler {
  constructor(url) {
    this.url = url;
  }

  connectDatabase() {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    try {
      mongoose.connect(this.url, connectionParams);
    } catch (error) {
      logger.error(error);
    }
  }

  async saveUser(data) {
    this.connectDatabase();
    const user = await this.findUserByMail(data.email);
    if (user) {
      return null;
    } else {
      var newUser = new userModel();
      newUser.id = await this.getHighestId();
      newUser.nombre = data.nombre;
      newUser.apellido = data.apellido;
      newUser.edad = data.edad;
      newUser.direccion = data.direccion;
      newUser.telefono = data.telefono;
      newUser.email = data.email;
      newUser.avatar = data.avatar;
      newUser.admin = data.admin;
      const encPass = await bcript.hash(data.password, 10);
      newUser.password = encPass;
      newUser.save((err) => {
        if (err) {
          logger.error(err);
        }
      });
      const message = {
        asunto: "Nuevo Registro",
        destino: "alexys.lehner94@ethereal.email",
        mensaje: `Un nuevo usuario se ha registrado.
        datos del usuario:
        - nombre y apellido: ${data.nombre} ${data.apellido},
        - edad: ${data.edad},
        - dirección: ${data.direccion},
        - telefono: ${data.telefono},
        - email: ${data.email}.`
      }
      enviarMail(message.asunto, message.mensaje, message.destino)
    }
  }

  async findUserByMail(email) {
    this.connectDatabase();
    const response = await userModel.findOne({ email: email });
    return response;
  }

  async findUserById(id) {
    this.connectDatabase();
    const response = await userModel.findOne({ id: id });
    return response;
  }

  async getHighestId() {
    this.connectDatabase();
    const data = await userModel.find({}, { id: 1, _id: 0 });
    if (data.length == 0) {
      return 1;
    } else {
      const highest = Math.max(...data.map((o) => o.id));
      const result = highest + 1;
      return result;
    }
  }
};
