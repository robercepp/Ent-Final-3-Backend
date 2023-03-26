//variables de entorno
require("dotenv").config();

//librerías necesarias
const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const flash = require("express-flash");
const yargs = require("yargs/yargs")(process.argv.slice(2));
const cluster = require("cluster");
const main = require("./controllers/main.js");
const multer = require("multer");
const logger = require("./utils/logger.js");

//sesiones
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

//conexion a mongoDb
const mongoUrl = process.env.MONGOURL;

//class
const userHandler = require("./classes/userHandler.js");
const usr = new userHandler(mongoUrl);

//conexión con base de datos
const { iniciarServidorFirebase, connectDB } = require("./config.js");

//engine handlebars
app.engine(
  "hbs",
  engine({
    defaultLayout: false,
  })
);

//middlewares
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGOURL,
      mongoOptions: advancedOptions,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

//passport
const initializePassport = require("./config/passport.js");
initializePassport(
  passport,
  (email) => usr.findUserByMail(email),
  (id) => usr.findUserById(id)
);

//storage local con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

//autenticadores
function auth(req, res, next) {
  if (req.user) {
    return next();
  } else {
    return res.redirect("/login");
  }
}
function notAuth(req, res, next) {
  if (req.user) {
    return res.redirect("/");
  } else {
    return next();
  }
}

//implementación de servidor
const iniciarServidor = async () => {
  try {
    iniciarServidorFirebase();
    connectDB().then(logger.info("MongoDb se encuentra conectado"));
    const server = app.listen(PORT, () => {
      logger.info(
        `Servidor Express iniciado en modo ${mode} escuchando en el puerto ${
          server.address().port
        } - Proceso N°: ${process.pid} `
      );
    });
    server.on("error", (error) => logger.error(`Error en servidor ${error}`));
  } catch (error) {
    logger.error(error);
  }
};

//Uso de Yargs para determinar el puerto y el modo del servidor
const { PORT, mode } = yargs
  .alias({
    p: "PORT",
    m: "mode",
  })
  .default({
    PORT: process.env.PORT || 8080,
    mode: "FORK",
  }).argv;

if (mode == "CLUSTER") {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
    
    logger.info(`Proceso Maestro: ${process.pid}`);
    cluster.on("exit", (worker, code, signal) => {
      logger.info(`el worker ${worker.process.pid} se ha cerrado`);
    });
  } else {
    iniciarServidor();
  }
} else {
  iniciarServidor();
}

const usuariosRuta = require("./routes/usuarios.js");
const productosRuta = require("./routes/productos.js");
const carritoRuta = require("./routes/carrito.js");

//rutas api
app.use("/api/productos", productosRuta);
app.use("/api/carrito", carritoRuta);
app.use("/api/usuarios", usuariosRuta);

//rutas principales
app.get("/", auth, main.main);

app.get("/login", notAuth, main.loginGet);

app.post(
  "/login",
  notAuth,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post('/purchase', auth, (req, res) => {
  main.notifyPurchase(req.body)
} )

app.get("/exit", (req, res) => {
  req.logout();
  return res.redirect("/");
});

app.get("/register", notAuth, main.registerGet);

app.post("/register", notAuth, upload.single("avatar"), main.registerPost);

app.get("/logout", auth, (req, res) => {
  res.render("logout", { nombre: req.user.nombre, titulo: "cierre de sesión" });
});

// default
app.get("*", main.notFound);
