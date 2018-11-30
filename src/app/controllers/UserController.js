const User = require('../models/User')

class UserController {
  async store (req, res) {
    const { email } = req.body

    // verificar se e-mail já existe.

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await User.create(req.body)

    return res.json(user)
  }
}

module.exports = new UserController()
