const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  // Verifica se header não existe.
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  /*
  Quando enviamos o Header Authorization para o backend, ele não vai só o token.
  Vai também a palavra 'Bearer' escrito na frente dele, com um espaço depois.

  Authorization: Bearer TOKEN

  Bearer -> é um pattern indicando que esse token é um token jwt para autenticação.

  ------

  Para remover a palavra 'Bearer' e deixar apenas o TOKEN, podemos usar o split neste authHeader.
  Separamos ele em duas partes, usando um espaço.
  => authHeader.split(' ')
  Como queremos apenas a segunda parte, colocamos uma vírgula dentro da desestruturação e colocamos a palavra token.
  => const [, token]
  */

  const [, token] = authHeader.split(' ')

  try {
    /*
    Passamos o token e o secret(que está dentro do authConfig ['../../config/auth'])
    Por padrão essa função não retorna uma promisse.
    Não consegue usar 'await', teria que usar callback(método antigo de trabalhar com assincronismo)
    O Nodejs tem uma funcionalidade integrada nele, o promisify, que transforma essas funções de padrão callback em promisses automaticamente.
    " const promisify = require('util') "
    */

    const decoded = await promisify(jwt.verify)(token, authConfig.secret)
    // A variável 'decoded' vai receber um objeto com o id do usuário.
    // Adicionamos dentro do req a variável userId com o decoded.id
    // Todo o middleware ou rota que for utilizar o req, a partir deste middleware pra frente, vai ter a informação de qual o id do usuário está fazendo aquela requisição.

    req.userId = decoded.id

    return next()
  } catch (err) {
    // Usamos try catch por volta, porque caso o jwt.verify retorne um erro, ele vai cair aqui dentro do catch.
    return res.status(401).json({ error: 'Token Invalid' })
  }
}
