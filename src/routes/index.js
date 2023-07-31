const { Router } = require("express")
const usersRoutes = require("./user.routes")
const sessionsRoutes = require("./sessions.routes")
const notesRoutes = require("./notes.routes")


const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/notes", notesRoutes)

module.exports = routes