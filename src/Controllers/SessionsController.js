const AppError = require("../Utils/AppError")
const knex = require("../database/knex")
const { compare } = require("bcryptjs")
const authConfig = require("../configs/auth")
const { sign } = require("jsonwebtoken")

class SessionsController {
  async create(request, response){
    const { email, password } = request.body

    const user = await knex("users").where({ email }).first()

    if(!user){
      throw new AppError("Email ou senha incorreta", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if(!passwordMatched){
      throw new AppError("Email ou senha incorreta", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json({
      status: "sucesssful",
      message: "Usuário Autenticado com Sucesso",
      token
    })
  }
}

module.exports = SessionsController