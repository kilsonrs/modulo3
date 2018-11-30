const express = require('express')
const mongoose = require('mongoose') /* ORM para bd não relacional, assim como o sequelize para bd relacionais */
const databaseConfig = require('./config/database')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.database()
    this.middlewares()
    this.routes()
  }
  database () {
    /* URI do banco. No Atlas seria: mongodb://usuario:senha@localhost:27017/nomedatabase
    Por padrão o docker vem sem usuário e senha. */
    mongoose.connect(
      databaseConfig.uri,
      {
        /* Para o mongoose saber que estamos usando uma versão mais recente do node, e ele precisa fazer algumas adaptações */
        useCreateIndex: true,
        useNewUrlParser: true
      }
    )
  }
  middlewares () {
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
