const User = require('../models/User')

class SessionController {
  // Metodo store() serve para fazer o papel de login
  async store (req, res) {
    const { email, password } = req.body

    // tentar encontrar um usuário com este e-mail.
    const user = await User.findOne({ email })

    if (!user) {
      // se não encontrar um usuário, então o e-mail não existe.
      return res.status(400).json({ error: 'User not found' })
    }

    // Se chegou até aqui o código, o usuário existe. Precisamos fazer uma comparação de senhas.
    if (!(await user.compareHash(password))) {
      // Se entrar aqui, é porque deu false, e com a negação deu true
      return res.status(400).json({ error: 'Invalid password' })
    }

    return res.json({ user, token: User.generateToken(user) })
  }
}

module.exports = new SessionController()
