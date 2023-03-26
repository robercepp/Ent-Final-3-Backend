require('dotenv').config()
const adminFirebase = require('firebase-admin');
const mongoose = require ('mongoose')
const logger = require ('./utils/logger.js')
const persistenceType = "mongo"
const FBServiceAccount = require ('./utils/anabellaecommerce-firebase-adminsdk-hpvar-3ee6cfd498.json');
const API_PORT = 8080
const MONGODB_PASSWORD = ""
const MONGODB_USER = ""
const FIREBASE_KEY = require ('./utils/anabellaecommerce-firebase-adminsdk-hpvar-3ee6cfd498.json');

const iniciarServidorFirebase = async () => {
    try {
      adminFirebase.initializeApp({
        credential: adminFirebase.credential.cert(FBServiceAccount),
      })
      logger.info('Firebase se encuentra conectado')
    } catch(error) {
      logger.error(error)
    }
  }
  
  const connectDB = async () => {
    const url = process.env.MONGOURL
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = {iniciarServidorFirebase, connectDB, persistenceType, API_PORT, MONGODB_PASSWORD, MONGODB_USER, FIREBASE_KEY}