const router = require("express").Router();
const dishesController = require("./dishes.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")


router.route("/")
    .get(dishesController.list)
    .post(dishesController.create)
    .all(methodNotAllowed)

router.route("/:dishId")
    .get(dishesController.read)
    .put(dishesController.update)
    .all(methodNotAllowed)
module.exports = router;
