const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

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

    await Mail.sendMail({
      from: '"Kilson®" <kilson@email.com>',
      to: purchaseAd.author.email,
      subject: `Solicitação de compra: ${purchaseAd.title}`,
      html: `<p>Teste: ${content}</p>`
    })

    return res.send()
  }
}

module.exports = new PurchaseController()
