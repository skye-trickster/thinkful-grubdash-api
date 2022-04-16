const path = require("path");
const ErrorCode = require("../errors/ErrorCodes");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
// VERIFICATION FUNCTIONS

/**
 * Check if property exists in data
 * @param {string} property the name of the property
 */
const propertyExists = (property) => {
    return function (request, response, next) {

        if (request.body.data[property]) return next()

        next(new ErrorCode(400, `Order must include a ${property}`))
    }
}

/**
 * Creates a function that ensures that the property isn't an empty string
 * @param {string} property the name of the property 
 */
const propertyStringNotEmpty = (property) => {
    return function (request, response, next) {
        const value = request.body.data[property]

        if (value && request.body.data[property] !== "") return next()

        return next(new ErrorCode(400, `Order must include a ${property}`))
    }
}

/**
 * Creates a function that ensures that the property isn't an empty string
 * @param {string} property the name of the property 
 */
const propertyArrayNotEmpty = (property) => {
    return function (request, response, next) {

        const value = request.body.data[property]

        if (Array.isArray(value) && value.length) return next()

        return next(new ErrorCode(400, `Order must include at least one ${property}`))
    }
}

const validateDishQuantity = (request, response, next) => {
    const { dishes } = request.body.data

    for (let index in dishes) {
        const { quantity } = dishes[index]
        if (!(quantity && typeof quantity === "number" && quantity > 0))
            return next(new ErrorCode(400, `Order ${index} must have a quantity that is an integer greater than 0`))
    }
    return next()
}

const propertyValidation = [
    propertyStringNotEmpty("deliverTo"),
    propertyStringNotEmpty("mobileNumber"),
    propertyExists("dishes"),
    propertyArrayNotEmpty("dishes"),
    validateDishQuantity
]

/** Given a dishId, looks for and stores the dish in response.locals.dish */
const orderExists = (request, response, next) => {
    let found = null
    let { orderId } = request.params

    found = orders.find((order) => order.id === orderId)

    if (!found) return next(new ErrorCode(404, `Order does not exist: ${orderId}`))

    response.locals.order = found
    next()
}

/** Given an id in the body, checks to make sure ID in body matches the paramater */
const idMatch = (request, response, next) => {
    const { id } = request.body.data
    const { orderId } = request.params

    if (!id || orderId === id) next()

    return next(new ErrorCode(400, `Order id does not match route id. Order: ${id}, Route: ${orderId}`))

}

/** Given a status, makes sure it's a valid status. 400 error otherwise. */
const checkValidStatus = (request, response, next) => {
    const { status } = request.body.data

    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"]

    if (!(status && status !== "" && validStatuses.includes(status)))
        return next(new ErrorCode(400, `Order must have a status of pending, preparing, out-for-delivery, delivered`))

    return next()
}

/** Given a status, makes sure that the status isn't delivered. 400 error otherwise. */
const statusNotDelivered = (request, response, next) => {

    const { status } = response.locals.order

    if (status === "delivered")
        return next(new ErrorCode(400, `A delivered order cannot be changed`))

    return next()
}

const statusPending = (request, response, next) => {
    const { status } = response.locals.order

    if (status === "pending")
        return next()

    return next(new ErrorCode(400, `An order cannot be deleted unless it is pending`))
}

// OPERATION FUNCTIONS
const list = (request, response) => {
    response.json({ data: orders })
}

const create = (request, response) => {

    const { data } = request.body

    const newOrder = {
        ...data,
        id: nextId()
    }

    orders.push(newOrder)

    response.status(201).json({ data: newOrder })
}

const read = (request, response) => {
    response.json({ data: response.locals.order })
}

const update = (request, response) => {
    let { order } = response.locals
    const { data } = request.body

    order = {
        ...order,
        ...data,
        id: request.params.orderId,
    }

    response.json({ data: order })
}

const destroy = (request, response) => {
    let { id } = response.locals.order

    const index = orders.findIndex((order) => order.id === id)

    const deletedIndex = orders.splice(index, 1)

    response.sendStatus(204)
}

module.exports = {
    list,
    create: [
        propertyValidation,
        create
    ],
    read: [
        orderExists,
        read
    ],
    update: [
        propertyValidation,
        orderExists,
        idMatch,
        checkValidStatus,
        statusNotDelivered,
        update
    ],
    delete: [
        orderExists,
        statusPending,
        destroy
    ]
}