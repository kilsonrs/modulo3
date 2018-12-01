const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body
    // ad -> id do anuncio da intenção de compra.
    // content -> mensagem do usuário para o anunciante.

    /*
    user -> Tem as informações do usuário logado
    purchaseAd -> Tem as informações do item que ele quer fazer a intenção de compra e do autor
    */
    const purchaseAd = await Ad.findById(ad).populate('author') // Verificar se existe o anuncio que o usuário quer fazer a intenção
    const user = await User.findById(req.userId)
    // const user = { name: 'Kilson', email: 'kilson@kil.com' }
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save() // Aqui o Queue salva esse job em nosso redis, pra ele então executar a fila

    return res.send()
  }
}

module.exports = new PurchaseController()
