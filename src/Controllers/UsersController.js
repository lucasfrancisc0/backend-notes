const AppError = require("../Utils/AppError")
const knex = require("../database/knex")
const { hash, compare} = require("bcryptjs")

class UsersController{
  async create(request, response){
    const { name, email, password } = request.body

    if(!name || !email || !password){
      throw new AppError("Necessários preenchimento de todos os campos para se cadastrar")
    }

    const checkEmailExists = await knex("users").select("email").where({ email }).first()

    if(checkEmailExists){
      throw new AppError("Este e-mail já está sendo utilizado.")
    }

    const hashedPassword = await hash(password, 8)

    await knex("users").insert({ name, email, password: hashedPassword })

    return response.status(201).json({
      status: "sucessful",
      message: "Usuário cadastrado com sucesso"
    })

  }
}


module.exports = UsersController