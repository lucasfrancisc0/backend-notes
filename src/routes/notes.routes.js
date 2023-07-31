const { Router } = require("express")
const NotesController = require("../Controllers/NotesController")
const ensureAuthenticated = require("../middleware/ensureAuthenticated")

const notesRoutes = Router()
const notesController = new NotesController()

notesRoutes.post("/", ensureAuthenticated, notesController.create)
notesRoutes.delete("/:note_id", ensureAuthenticated, notesController.delete)
notesRoutes.put("/:note_id", ensureAuthenticated, notesController.update)
notesRoutes.get("/", ensureAuthenticated, notesController.index)



module.exports = notesRoutes