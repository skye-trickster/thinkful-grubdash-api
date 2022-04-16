const router = require("express").Router();
const orderController = require("./orders.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/")
    .get(orderController.list)
    .post(orderController.create)
    .all(methodNotAllowed)

router.route("/:orderId")
    .get(orderController.read)
    .put(orderController.update)
    .delete(orderController.delete)
    .all(methodNotAllowed)

module.exports = router;
