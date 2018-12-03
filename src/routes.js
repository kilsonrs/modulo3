const express = require('express')
const validate = require('express-validation')
const handle = require('express-async-handler')
const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

// Substituindo os abaixo pelo 'require-dir'
// const UserController = require('./app/controllers/UserController')
// const SessionController = require('./app/controllers/SessionController')

const controllers = require('./app/controllers')
const validators = require('./app/validators')

routes.post(
  '/users',
  validate(validators.User),
  handle(controllers.UserController.store)
)
routes.post(
  '/sessions',
  validate(validators.Session),
  handle(controllers.SessionController.store)
)

/*
routes.use(authMiddleware)
Isso garante que toda rota a partir daqui pra baixo esteja
configurada pra não aceitar se o usuário não estiver autenticado.
*/
routes.use(authMiddleware)

// Ads

routes.get('/ads', handle(controllers.AdController.index))
routes.get('/ads/:id', handle(controllers.AdController.show))
routes.post(
  '/ads',
  validate(validators.Ad),
  handle(controllers.AdController.store)
)
routes.put(
  '/ads/:id',
  validate(validators.Ad),
  handle(controllers.AdController.update)
)
routes.delete('/ads/:id', handle(controllers.AdController.destroy))

// Purchases

routes.post(
  '/purchases',
  validate(validators.Purchase),
  handle(controllers.PurchaseController.store)
)

module.exports = routes
