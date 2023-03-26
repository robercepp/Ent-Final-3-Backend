# Anabella Avena - Ecommerce

El proyecto consta de crear un e-commerce orientado a la venta de trabajos de ilustración y diseños creados por la Ilustradora Anabella Avena, de acuerdo con los líneamientos y requisitos del actual curso de backend que imparte Coderhouse. 

## Comenzando 🚀

esta entrega está desarrollada de acuerdo con las pautas de la segunda entrega final del curso de Backend de coderhouse. comisión 40280
url: "https://github.com/robercepp/proyecto-final-backend"

### Pre-requisitos 📋

- Visual studio code (ultima version estable).
- git.
- node (ultima versión estable).
- nodemon (instalado de forma global).

basicamente se trata de descargar el repositorio ya sea desde un pull desde la consola de git o manualmente y luego descomprimiendo.

### Instalación 🔧

Tras haber descargado el repositorio: 
-Ejecutar Visual studio code,
-Abrir carpeta raíz del proyecto en visual studio code,
-Abrir una consola nueva,
-Tipear "npm install" en la terminal, (esto descargarán las dependencias requeridas para el correcto funcionamiento del proyecto)
-tipear en una consola (del tipo powershell o gitBash, siempre posicionada en el directorio raíz del proyecto) "npm run start". Para cargar el servidor,
-abrir cualquier explorador (actualizado a la última versión, ej: chrome, edge o firefox),
- tipear en la barra de direcciones del explorador "localhost:8080" o el puerto indicado según la consola del servidor activo y presionar "enter" (esto cargará el frontend del proyecto)

## Ejecutando las pruebas ⚙️

Las pruebas están mayormente pensadas para ser realizadas dentro del entorno del frontend ofrecido.

Las pruebas realizadas están basadas según las rúbricas de la 3ra entrega del proyecto final. por lo que la correcta ejecución de las funciones han sido debidamente probadas previo a la carga en github. estas son:

- 1 La creación de un registro y autenticación de usuarios usando passport-local, guardando en una base de datos (Mongo Atlas en este caso) las credenciales y el resto de datos ingresado al momento del registro.

- 2 El registro de usuario ha sido ampliado para dar lugar a almacenamiento de datos diversos como: 
nombre, apellido, dirección, edad, número de telefono (discado internacional), una imagen tipo avatar, y la contraseña que está debidamente cifrada con el uso de bcrypt.

- 3 Las imagen tipo avatar ha sido alojadas en el directorio "avatars" dentro de la carpeta "public" estas tienen el email de cada usuario como nombre, de esa forma se impide que un usuario reemplace la imagen avatar de otro usuario agregando una imagen con un nombre igual. 
nota: las imágenes admitidas son solamente .jpg por el momento.

- 4 El formulario de inicio de sesión (login) toma como dato el email registrado como identificador único de la cuenta. La contraseña es la ingresada (doblemente para evitar un ingreso erroneo) en el formulario de registro.

- 5 Ante el registro de una nueva cuenta de usuario en el servidor, un email es enviado a la administración notificando dicho suceso. El destino de dicho mail es a una cuenta "mock" en ethereal mail, esto en el futuro cambiará a una cuenta definitiva.

- 6 Cuando un usuario confirma el pedido de productos almacenados en el carrito, se notifica dicho suceso mediante un email emitido desde una cuenta Gmail al administrador, y a su vez se envía un SMS a un número de telefono informando que un usuario dado ha solicitado productos (se listan los productos y cantidades) y que la solicitud se encuentra en proceso. 

- 7 El servidor trabaja con MongoDBAtlas para administrar las cargas, altas, bajas, sesiones y carritos de los usuarios. Actualmente se encuentra cargado y siendo ejecutado en el servicio "railway" link: "https://github.com/robercepp/proyecto-final-backend"

- 8 El servidor cuenta con un inicio en modo "fork" o en modo "cluster" así también como un parámetro para la elección del puerto en el cuál se ejecutará.
ej: "node server.js -p 8080 -m FORK" (este comando ejecuta el servidor escuchando en el puerto 8080 y en modo fork).
ej2: "node server.js -p 8082 -m CLUSTER" (se ejecuta escuchando el puerto  8082 en modo cluster).

- 9 Se reemplazan todos los console.log por el logger "winston" siendo que tanto los logs de información, error y warning se muestran por consola. los logs de error y warning se guardan en los archivos error.log y warn.log respectivamente.

- 10 se realizan pruebas de Artillery en el endpoint de listado de productos (/api/productos) con una conexión de 50 usuarios simultaneos de 20 peticiones cada uno [artillery quick --count 50 -n 20 "http://localhost:8080/api/productos"] en modo FORK, dando una respuesta promedio de 140.7ms y en modo CLUSTER dando una respuesta de servidor de 128.9 promedio


## Construido con 🛠️

Visual studio code

## Dependencias utilizadas 🛠️

    bcryptjs ver.2.4.3
    body-parser ver.1.20.2
    connect-mongo ver.5.0.0
    cookie-parser ver.1.4.6
    dotenv ver.16.0.3
    express ver.4.18.2
    express-flash ver.0.0.2
    express-handlebars ver.7.0.4
    express-session ver.1.17.3
    firebase-admin ver.11.5.0
    mongoose ver.6.8.4
    multer ver.1.4.5-lts.1
    nodemailer ver.6.9.1
    passport ver.0.4.1
    passport-local ver.1.0.0
    twilio ver.4.9.0
    winston ver.3.8.2
    yargs ver.17.7.1

    nota: "Toastify" y "Sweet Alert" son usados del lado de frontend para amenizar las alertas visuales e informar de ciertos sucesos dentro del servidor tales como logeos exitosos, cargas y eliminacion de productos en el carrito y así también como registros de usuarios nuevos como de confirmación de compras en el carrito. 

## Autores ✒️

* **Robertino Cepparo** - *Trabajo Inicial* - [robercepp](https://github.com/robercepp)

## Licencia 📄

Este proyecto está bajo la Licencia (ISC) - (use bajo su propio riesgo)
😊