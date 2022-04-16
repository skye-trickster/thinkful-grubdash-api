const router = require("express").Router();
const orderController = require("./orders.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")
// TODO: Implement the /orders routes needed to make the tests pass

router.route("/").get(orderController.list)
    .post(orderController.create)
    .all(methodNotAllowed)

router.route("/:orderId")
    .get(orderController.read)
    .put(orderController.update)
    .delete(orderController.delete)
    .all(methodNotAllowed)

module.exports = router;
