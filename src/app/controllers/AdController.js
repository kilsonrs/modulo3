const Ad = require('../models/Ad')

class AdController {
  // Metodo para listagem
  async index (req, res) {
    const ads = await Ad.find() // Não passa nada pra ele buscar todos os Ads

    return res.json(ads)
  }

  // Mostrar um único Ad
  async show (req, res) {
    const ad = await Ad.findById(req.params.id) // Pra pegar o parametro que vem da rota pra pegar um único Ad

    return res.json(ad)
  }

  // Criar um Ad
  async store (req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId }) // Esse 'req.userId' preenchemos lá em nosso middleware de autenticação com o Id do usuário que vem pelo 'jwt'.

    return res.json(ad)
  }

  // Edição
  async update (req, res) {
    /*
    O 'findByIdAndUpdate' recebe o 'Id' como primeiro parâmetro.
    Depois recebe todas as informações que queremos atualizar 'naquilo lá' (no 'model').
    Depois passamos um array de configuração. Passamos aqui o 'new:' sendo 'true'.

    Esse new:true vai, depois de dar o update, ele vai atualizar essa informação aqui do ad com as novas informações,
    pra que a possamos retorna-las para o front-end já atualizadas.
    */
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    return res.json(ad)
  }

  // Deletar
  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)

    return res.send()
  }
}

module.exports = new AdController()
