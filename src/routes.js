const express = require('express')
const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

// Substituindo os abaixo pelo 'require-dir'
// const UserController = require('./app/controllers/UserController')
// const SessionController = require('./app/controllers/SessionController')

const controllers = require('./app/controllers')

routes.post('/users', controllers.UserController.store)
routes.post('/sessions', controllers.SessionController.store)

/*
routes.use(authMiddleware)
Isso garante que toda rota a partir daqui pra baixo esteja
configurada pra não aceitar se o usuário não estiver autenticado.
*/
routes.use(authMiddleware)

// Ads

routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post('/ads', controllers.AdController.store)
routes.put('/ads/:id', controllers.AdController.update)
routes.delete('/ads/:id', controllers.AdController.destroy)

// Purchases

routes.post('/purchases', controllers.PurchaseController.store)

module.exports = routes
