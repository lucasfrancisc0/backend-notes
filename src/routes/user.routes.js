const { Router } = require("express")

const multer = require("multer")
const uploadConfig = require("../configs/upload")

const UsersController = require("../Controllers/UsersController")
const UserAvatarController = require("../Controllers/UserAvatarController")

const ensureAuthenticated = require("../middleware/ensureAuthenticated")


const usersRoutes = Router()

const upload = multer(uploadConfig.MULTER)

const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.delete("/", ensureAuthenticated, usersController.delete)
usersRoutes.get("/", ensureAuthenticated, usersController.index)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)



module.exports = usersRoutes