const { Router } = require("express")
const UsersController = require("../Controllers/UsersController")
const ensureAuthenticated = require("../middleware/ensureAuthenticated")


const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.delete("/", ensureAuthenticated, usersController.delete)
usersRoutes.get("/", ensureAuthenticated, usersController.index)



module.exports = usersRoutes