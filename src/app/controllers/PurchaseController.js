const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
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
    if (purchaseAd.purchasedBy) {
      return res.json({ Error: 'Ad already purchased' })
    }
    // const user = { name: 'Kilson', email: 'kilson@kil.com' }
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save() // Aqui o Queue salva esse job em nosso redis, pra ele então executar a fila

    const purchase = await Purchase.create({
      user,
      ad: purchaseAd,
      content
    })

    return res.json(purchase)

    // return res.send()
  }
  async update (req, res) {
    const { ad, user } = await Purchase.findById(req.params.id)
    const itemComprado = await Ad.findByIdAndUpdate(
      ad,
      { purchasedBy: user },
      {
        new: true
      }
    )
    return res.json(itemComprado)
  }
}

module.exports = new PurchaseController()
