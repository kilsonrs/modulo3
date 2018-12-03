require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose') /* ORM para bd não relacional, assim como o sequelize para bd relacionais */
const Youch = require('youch') // formatador de erros, vai deixar os erros de uma forma mais legível.
const Sentry = require('@sentry/node')
const validate = require('express-validation')
const databaseConfig = require('./config/database')
const sentryConfig = require('./config/sentry')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.sentry() // Configurado antes de todos, para que todos saibam disso
    this.database()
    this.middlewares()
    this.routes()
    this.exception() // Precisa estar depois das configurações das rotas
  }

  sentry () {
    Sentry.init(sentryConfig)
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
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routes'))
  }
  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    // Middleware pra tratar das exceções
    // Toda vez que tiver um erro em nossa aplicação que não for um erro de validação,
    // vamos retornar um erro cmo código de 500, ou se ele tiver um status, vai assumir
    // o status dele, com uma mensagem 'Internal Server Error'.
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      // Verifica se está em ambiente de desenvolvimento.
      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)
        // return res.json(await youch.toJSON()) // Youch exibe erro por JSON
        return res.send(await youch.toHTML()) // Youch exibe erro por HTML
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}

module.exports = new App().express
