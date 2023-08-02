const AppError = require("../Utils/AppError")
const knex = require("../database/knex")

class NotesController{
 async create(request, response){
  const { title, description, tags, links } = request.body
  const user_id = request.user.id

  const user = await knex("users").select("id").where({ id: user_id }).first()

  if(!user){
    throw new AppError("Usuário não encontrado.")
  }

  if(!title | !description ){
    throw new AppError("O título e descrição são obrigatórios.")
  }

  const [note_id] = await knex("notes").insert({ title, description, user_id})

  if(tags){
    const tagsInsert = tags.map( name => {
      return {
        name,
        user_id,
        note_id
      }
    })

    await knex("tags").insert(tagsInsert)
  }

  if(links){
    const linksInsert = links.map( url => {
      return {
        url,
        note_id
      }
    })

    await knex("links").insert(linksInsert)
  }



  return response.json({
    message: "Nota criada com sucesso."
  })
 }

 async delete(request, response) {
  const { note_id } = request.params
  const user_id = request.user.id

  const user = await knex("users").select("id").where({ id: user_id }).first()

  if(!user){
    throw new AppError("Usuário não encontrado.")
  }

  const note = await knex("notes").select("*").where({ id: note_id, user_id})

  if(!note){
    throw new AppError("Nota não encontrada.")
  }

  await knex("notes").delete().where({ id: note_id, user_id})

  return response.json({
    message: "Nota excluída com sucesso."
  })
 }

 async update(request, response){
  const { title, description } = request.body
  const { note_id } = request.params
  const user_id = request.user.id

  const note = await knex("notes").select("*").where({ id: note_id, user_id}).first()

  if(!note){
    throw new AppError("Nota não encontrada.")
  }

  await knex("notes").update({
    title,
    description
  })

  return response.json({
    message: "Nota alterada com sucesso."
  })

 }

 async index(request, response){
  const { title, tags, note_id} = request.query
  const user_id = request.user.id

  let note

  if(title){
    const searchNoteTitle = await knex("notes")
    .select("*")
    .where({ user_id })
    .whereLike("title", `%${title}%`)
    console.log(searchNoteTitle)

    note = searchNoteTitle.length > 0 ? searchNoteTitle : "Não existem notas cadastradas com este título."
  }

  if(tags){
    const filterTags = tags.split(",").map( tag => tag.trim())

    const searchNoteTags = await knex("tags")
    .select([
      "notes.title",
      "notes.description"
    ])
    .where("notes.user_id", user_id )
    .whereIn("tags.name", filterTags)
    .innerJoin("notes", "notes.id", "tags.note_id")
    .orderBy("title")

    note = searchNoteTags ?? "Não existem notas com as tags cadastradas."
  }

  if(note_id){
    const searchNoteId = await knex("notes").select("title", "description").where({ id: note_id, user_id}).first()

    note = searchNoteId ?? "Não existem notas cadastradas com este ID"
  }

  return response.json(note)
 }
}

module.exports = NotesController