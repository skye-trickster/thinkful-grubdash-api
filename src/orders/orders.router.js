const router = require("express").Router();
const orderController = require("./orders.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")
// TODO: Implement the /orders routes needed to make the tests pass

router.route("/").get(orderController.list)
    .post(orderController.create)

router.route("/:orderId")
    .get(orderController.read)
    .put(orderController.update)
    .delete(orderController.delete)

module.exports = router;
