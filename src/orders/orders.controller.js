const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

const controller = require("../controller");
const ErrorCode = require("../errors/ErrorCodes");
// TODO: Implement the /orders handlers needed to make the tests pass

const checkOrderStatus = (request, response, next) => {
    console.log(response.locals.item.status)

    if (response.locals.item.status !== "pending") {
        console.log(response.locals.item.status)
        return next(new ErrorCode(400, "pending"))
    }

    return next()
}

const verifyUpdateOrderStatus = (request, response, next) => {
    const { status } = response.locals.item
    if (status === "invalid")
        return next(new ErrorCode(400, "Unable to update invalid statuses"))
    return next()
}

module.exports = controller(orders, nextId, {
    paramName: "orderId",
    requiredProperties: ["deliverTo", "mobileNumber", `dishes`],
    updateVerifications: [verifyUpdateOrderStatus],
    deleteVerifications: [checkOrderStatus]
})