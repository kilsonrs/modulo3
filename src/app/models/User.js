const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') // -> Faz a criação dos tokens e a verificação se estão validados.
const authConfig = require('../../config/auth')

/*
O mongodb salva os dados por completo, não segue uma estrutura de "Coluna > Dado".
Num bd não relacional, nossos não precisam seguir uma estrutura diretamente, pr isso, não temos migrations.
Cada dado pode ter formatos diferentes.
Não precisa criar migrations, e sempre que alterar um campo, podemos adicionar ou remover deste Schema.
*/

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

/*
Criptografar a senha do usuário, assim que ela for salva no bd.
Hook faz a parte de ouvir as ações que são realizada no lado do usuário, pra gente conseguir manipular os dados.

Hook será disparado antes de todo o 'save', tanto na criação quanto no update.

pre() -> Pra que o Hook aconteça antes de alguma ação. Aqui será disparado antes todo o 'save' no usuário.
'save' -> Disparado tanto na criação quanto pra update
function -> Função usada no formato padrão, sem arrow function. O mongoose vai dar pra gente dentro do 'this', o usuário em si, a instancia com todos os dados do usuário.
isModified('password') -> Faz verificação se o password não foi modificado nesta alteração. Neste caso não queremos fazer nada, chamando o next().
next() -> Passa para o proximo Hook ou para parte de salvar no bd.
8 -> É a força da senha. Valor muito alto afeta a performance.
*/
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  this.password = await bcrypt.hash(this.password, 8)
})

/*
UserSchema.methods -> Aqui dentro posso declarar todos os métodos que eu quero que cada instancia do usuário tenha.
compareHash(password) -> Este método vai receber uma senha sem criptografia e comparar se esta senha bate com a senha que tenho criptografa dentro do usuário no bd.
*/
UserSchema.methods = {
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}

/*
Esse método vai retornar um token.
Ele é estático, porque não vai ser disparado através de uma instância, duma classe já instanciada.
Vamos disparar ele diretamente através do model User, e não duma instância do usuário.
*/
UserSchema.statics = {
  // generateToken() -> Método estático que recebe um usuário. Pela desestruturação pega apenas o id do usuário.
  generateToken ({ id }) {
    /*
    jwt.sign() -> Aqui pode passar quantas informações do usuário eu quiser.
    Elas ficarão criptografadas dentro do token.
    Podemos descriptografar o token,o que não é problemático, e ter acesso as informações que estão aqui dentro.
    Por padrão passamos o id.

    'GoNode03' (authConfig.secret) -> secret único da aplicação para que um token não seja válido numa outra aplicação  que também utiliza o formato jwt.
    expiresIn: (authConfig.ttl) -> Define quento tempo este token vai ser válido.
    */
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl
    })
  }
}
module.exports = mongoose.model('User', UserSchema)
/* module.exports = mongoose.model('Nome do model', Schema que foi criado) */
