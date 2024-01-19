const { Router } = require("express");

const userController = require("../controllers/userController")
const noteController = require("../controllers/noteController")

const auth = require("../middlewares/auth")

const router = Router()

//users
router.post("/users/register", userController.create)
router.post("/users/login",  userController.login)
router.get("/users/list", auth.private, userController.list)

router.put("/users/edit", auth.private, userController.edit)
router.put("/users/password", auth.private, userController.password)
router.delete("/users/del", auth.private, userController.del)

//notes
router.get("/notes/search", auth.private, noteController.search)
router.get("/notes/list", auth.private, noteController.listNotes)
router.get("/notes/:id", auth.private, noteController.oneNote)
router.post("/notes/register", auth.private, noteController.create)
router.put("/notes/:id", auth.private, noteController.update)
router.delete("/notes/:id", auth.private, noteController.delete)


router.use((request, response)=>{
    return response.status(404).json({Message: "Página não encontrada"})

})

module.exports = router