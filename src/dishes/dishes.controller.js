const path = require("path");
const ErrorCode = require("../errors/ErrorCodes");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// VALIDATION FUNCTIONS

/**
 * Check if property exists in data
 * @param {string} property the name of the property
 */
const propertyExists = (property) => {
    return function (request, response, next) {

        if (request.body.data[property]) return next()

        next(new ErrorCode(400, `Dish must include a ${property}`))
    }
}

/**
 * Creates a function that ensures that the property isn't an empty string
 * @param {string} property the name of the property 
 */
const propertyNotEmpty = (property) => {
    return function (request, response, next) {

        if (request.body.data[property] !== "") return next()

        return next(new ErrorCode(400, `Dish must include a ${property}`))
    }
}

/**
 * Creates a function that ensures that the property is a number
 * @param {string} property 
 */
const propertyValidNumber = (property) => {
    return function (request, response, next) {
        const value = request.body.data[property]
        if (typeof value === "number") return next()
        return next(new ErrorCode(400, `Dish must include a ${property} that is an integer greater than 0`))
    }
}

/**
 * Creates a function that ensures that the property is above a minimum
 * @param {string} property The property name
 * @param {number} min The minimum value that the property should be
 * @returns {function}
 */
const propertyMinimum = (property, min) => {
    return function (request, response, next) {
        const value = request.body.data[property]
        if (value >= min) return next()
        return next(new ErrorCode(400, `Dish must include a ${property} that is an integer greater than ${min}`))
    }
}

/** Given a dishId, looks for and stores the dish in response.locals.dish */
const dishExists = (request, response, next) => {
    let found = null
    let { dishId } = request.params

    found = dishes.find((dish) => dish.id === dishId)

    if (!found) return next(new ErrorCode(404, `Dish does not exist: ${dishId}`))

    response.locals.dish = found
    next()
}

/** Given an id in the body, checks to make sure  */
const idMatch = (request, response, next) => {
    const { id } = request.body.data
    const { dishId } = request.params

    if (!id || dishId === id) next()

    return next(new ErrorCode(400, `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`))

}

/** list of all property validation functions */
const validPropertyCheck = [
    propertyExists("name"),
    propertyNotEmpty("name"),
    propertyExists("description"),
    propertyNotEmpty("description"),
    propertyExists("image_url"),
    propertyNotEmpty("image_url"),
    propertyExists("price"),
    propertyValidNumber("price"),
    propertyMinimum("price", 0)
]

// OPERATION FUNCTIONS

const list = (request, response) => {
    response.json({ data: dishes })
}

const create = (request, response) => {
    const { data: { name, description, price, image_url } = {} } = request.body
    const dish = {
        id: nextId(),
        name,
        description,
        price,
        image_url
    }

    dishes.push(dish)
    response.status(201).json({ data: dish })
}

const read = (request, response) => {
    response.json({ data: response.locals.dish })
}

const update = (request, response) => {
    let { dish } = response.locals
    const { data } = request.body

    dish = {
        ...dish,
        ...data,
        id: request.params.dishId,
    }

    response.json({ data: dish })
}

module.exports = {
    list,
    create: [
        validPropertyCheck,
        create
    ],
    read: [
        dishExists,
        read
    ],
    update: [
        dishExists,
        idMatch,
        validPropertyCheck,
        update
    ]
}