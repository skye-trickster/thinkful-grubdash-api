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

const verifyDishAmount = (request, response, next) => {
    const { dishes, id } = response.locals.item

    if (!(dishes || dishes.length))
        return next(new ErrorCode(400, `Dish ${id} must have a quantity that is an integer greater than 0`))

    for (let index in dishes) {
        const dish = dishes[index]
        if (!dish.quantity)
            return next(new ErrorCode(400, `Dish ${id} must have a quantity that is an integer greater than 0`))
    }


    return next()


}

const verifyUpdateOrderStatus = (request, response, next) => {
    const { status } = request.body.data

    if (status && ["pending", "preparing", "out-for-delivery"].includes(status))
        return next()

    if (status === "delivered")
        return next(new ErrorCode(400, "A delivered order cannot be changed"))

    return next(new ErrorCode(400, "Order must have a status of pending, preparing, out-for-delivery, delivered"))
}

module.exports = controller(orders, nextId, {
    paramName: "orderId",
    requiredProperties: ["deliverTo", "mobileNumber", `dishes`],
    updateVerifications: [verifyUpdateOrderStatus],
    deleteVerifications: [checkOrderStatus, verifyDishAmount]
})