const Ad = require('../models/Ad')

class AdController {
  // Metodo para listagem
  async index (req, res) {
    // const ads = await Ad.find() // Não passa nada pra ele buscar todos os Ads

    /* const filters = {}
    Variável 'filters' armazena os filtros que virão por query params, dentro de 'req.query'
    */
    const filters = {}

    /*
    $gte -> grather than. Busca todos os Ad que tenha preços 'maiores que'
    $lte -> lower than. Busca todos os Ad que tenha preços 'menores que'
    Interpretados pelo Mongoose
    */
    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }

      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }

    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i')
      // RegExp -> Para buscar em qualquer lugar no título.
      // 'i' -> Transforma RegExp em case-insensitive.
    }

    /*
    Ad.paginate({}) -> Paginação na listagem. Plugin 'mongoose-paginate', importado no model 'Ad'.
    {} -> Filtro. Exemplo: { price:2000 }
    {} -> Segundo objeto passando as propriedades:
      page: -> Página atual. Vem por parâmetro GET, através dos query params.
          Padrão 1 caso não tenha req.query.page
      limit: -> Quantos itens por página
    sort: '-createdAt' -> Ordenados por createdAt ao contrário, tem um menos '-' antes. De forma descendente.
    populate: ['author'] -> Traz informações dos relacionamentos entre tabelas, no caso aqui, 'author'.
    Obs.: Seria usado ".populate('author) -> caso estivesse usando Ad.find()"
    */
    const ads = await Ad.paginate(
      // {}, Substituído pela variável 'filters'
      filters,
      {
        page: req.query.page || 1,
        limit: 20,
        populate: ['author'],
        sort: '-createdAt'
      }
    )

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
