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

  async update(request, response){
    const { name, email, old_password, password} = request.body
    const user_id = request.user.id

    const user = await knex("users").select("*").where({ email }).first()

    if(!user){
      throw new AppError("Usuário não encontrado!")
    }

    const checkUserEmail = await knex("users").select("email", "id").where({ id: user_id }).first()

    if(checkUserEmail && checkUserEmail.id !== user.id){
      throw new AppError("Este email já está sendo utilizado.")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password){
      throw new AppError("Necessário informar senha atual para alteração de senha.")
    }

    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password)

      if(!checkOldPassword){
        throw new AppError("Senha incorreta.")
      }

      user.password = await hash(password,8)
    }

    await knex("users").update({
      name: user.name,
      email: user.email,
      password: user.password
    })

    return response.json({
      status: "Sucessful",
      message: "Alterações realizadas com sucesso."
    })
  }

  async delete(request, response){
    const user_id = request.user.id

    const user = await knex("users").select("*").where({ id: user_id }).first()

    if(!user){
      throw new AppError("Usuário não encontrado!")
    }

    await knex("users").delete().where({ id: user_id })

    return response.json({
      message: "Usuário deletado com sucesso."
    })
  }

  async index(request, response){
    const user_id = request.user.id
    const { name, email } = request.query

    let user = await knex("users").select("name", "email", "avatar").where({ id: user_id}).first()

    if(name){
      const searchName = await knex("users").select("id", "name")
      .whereLike("name", `%${name}%`)

      user = searchName ?? "Usuário não encontrado."
    }

    if(email){
      const searchEmail = await knex("users").select("id", "email")
      .where({ email }).first()

      user = searchEmail ?? "Usuário não encontrado."
    }

    if(!user){
      throw new AppError("Usuário não encontrado.")
    }

    return response.json(user)
  }

}


module.exports = UsersController