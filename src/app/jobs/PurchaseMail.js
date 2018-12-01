const Mail = require('../services/Mail')

class PurchaseMail {
  get key () {
    // get ->  pra conseguir fazer 'PurchaseMail.key'
    return 'PurchaseMail'
  }

  /*
  handle() -> fará a parte de enviar e-mail.
  Essa função recebe dois parâmetros:
  job -> Contém várias informações sobre o job
  done -> Deve ser chamada assim que terminar de executar o job
  */
  async handle (job, done) {
    const { ad, user, content } = job.data // .data -> propriedade do job que tem todas essas informações

    await Mail.sendMail({
      from: '"Kilson®" <kilson@email.com>',
      to: ad.author.email,
      subject: `Solicitação de compra: ${ad.title}`,
      // html: `<p>Teste: ${content}</p>`
      template: 'purchase',
      context: { user, content, ad } // Contém todas as variáveis que vamos enviar. Enviando 'purchaseAd' como 'ad'
    })
    return done()
  }
}

module.exports = new PurchaseMail()
