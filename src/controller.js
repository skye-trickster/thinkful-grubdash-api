const ErrorCode = require("./errors/ErrorCodes")

class Controller {
    constructor(controlledList) {
        this.list = controlledList
    }

    get() { return this.list }
    /** Filter */
    filter(key, value) { return this.list.filter((item) => item[key] === value) }

    findById(id, findIndex = false) {
        const result = { item: undefined, index: undefined }
        result.item = this.list.find((item, index) => {
            if (item.id !== id) return false
            if (findIndex) result.index = index
            return true
        })
        return findIndex ? result : result.item
    }

    deleteById(id) {
        const index = this.findById(id, true).index
        const deleted = this.list.splice(index, 1)
        return deleted
    }

    static checkQueries(object, queries) {

        return function (request, response, next) {
            //if (!request.query) return;
            const queryList = []

            for (let q in queries) {
                if (q in request.query) {
                    queryList.push({ query: q, value: request.query[q] })
                    delete request.query[q]
                }
            }

            if (queryList.length) response.locals.queryList = queryList
            next()
        }

    }

    static executeQueries(object, queries) {
        return function (request, response, next) {
            //console.log(response.locals.queryList)

            for (let q in response.locals.queryList) {
                const { query } = response.locals.queryList[q]

                queries[query](response.locals.list, response.locals.queryList[q].value)
            }
            next()
        }
    }

    /** Creates a filter function that filters based on queries */
    static filter(object) {
        return function (request, response, next) {

            if (Object.keys(request.query).length) {
                const exact = Boolean(request.query.exact)
                response.locals.list = object.list.filter((item) => {
                    for (let key in request.query) {

                        if (typeof item[key] === "number") {

                            if (item[key] !== Number(request.query[key]))
                                return false
                        }
                        else {
                            if (key === "exact") continue

                            const searchTerm = item[key].toLowerCase()
                            const value = request.query[key].toLowerCase()

                            if (exact && searchTerm !== value)
                                return false
                            if (!(exact || searchTerm.includes(value)))
                                return false

                        }
                    }
                    return true
                })

            } else {
                response.locals.list = object.list
            }

            next()
        }
    }

    static getAll(object) {
        return function (request, response) {
            const list = response.locals.list
            if (!list) list = object.list
            response.json({ data: response.locals.list })
        }
    }

    static requiredPropertyCheck(properties) {
        const functions = []
        for (let prop in properties)
            functions.push(this.bodyHasPropertyName(properties[prop]))

        return functions
    }

    static bodyHasPropertyName(property) {
        return function (request, response, next) {
            const { data = {} } = request.body;

            if (data[property]) return next()
            next(new ErrorCode(404, `Must include ${property} property`))
        }
    }

    static objectExists(object, param) {
        return function (request, response, next) {
            const id = request.params[param]

            if (response.locals.list) {

                const find = response.locals.list.find((item, index) => {

                    if (id === item.id) {
                        response.locals.item = item
                        response.locals.index = index
                        return true
                    }
                    return false
                })
                if (find) return next()

            } else {
                const found = object.findById(id, true)
                //console.log(id)
                if (found.item) {
                    response.locals.item = found.item
                    response.locals.index = found.index
                    return next()
                }
            }

            next(new ErrorCode(404, `Item ID not found: ${id}`))
        }
    }

    static read(request, response) {
        response.json({ data: response.locals.item })
    }

    static update(request, response) {
        const foundItem = response.locals.item
        const { data } = request.body

        for (let param in data) {
            foundItem[param] = data[param]
        }

        response.json({ data: foundItem })
    }

    static create(object, nextId) {
        return function (request, response) {
            const { data = {} } = request.body
            const newItem = {
                ...data,
                id: nextId()
            }
            object.list.push(newItem)
            response.status(201).json({ data: newItem })
        }
    }

    static delete({ list }) {
        return function (request, response) {
            const deleted = list.splice(response.locals.index, 1)
            response.sendStatus(204)
        }
    }

}

/**
 * Creates a new controller object from a list
 * @param {Array} list The list of items to make a controller with
 * @param {Function} nextId the nextId function to call when creating an object
 * @param {Object} options Additional configurations
 * @param {string} options.paramName The name of the parameter id for read methods
 * @param {Boolean} options.template 
 *      True: returns a customizable template object
 *      False: returns a basic CRUD object
 * @param {Array<string>} options.requiredProperties Required properties to pass through 
 * @returns {object} 
 */
const controller = (list, nextId, options = {}) => {
    const {
        paramName = "id",
        requiredProperties = [],
        template = false,
        additionalQueries = {},
        deleteVerifications = [],
        updateVerifications = []
    } = options
    //console.log(additionalQueries)
    const item = new Controller(list);

    // creates a template object for full customizability
    const objectTemplate = {
        item,
        list: Controller.getAll(item),
        requiredProperties: Controller.requiredPropertyCheck(requiredProperties),
        create: Controller.create(item, nextId),
        objectExists: Controller.objectExists(item, paramName),
        read: Controller.read,
        update: Controller.update,
        delete: Controller.delete(item),
        filter: Controller.filter(item),
        checkQueries: Controller.checkQueries(item, additionalQueries),
        executeQueries: Controller.executeQueries(item, additionalQueries),
    }

    if (template) return objectTemplate

    // Returns an example CRUD object
    return {
        item,
        list: [
            objectTemplate.checkQueries,
            objectTemplate.filter,
            objectTemplate.executeQueries,
            objectTemplate.list
        ],
        create: [
            objectTemplate.checkQueries,
            objectTemplate.filter,
            objectTemplate.requiredProperties,
            objectTemplate.create
        ],
        read: [
            objectTemplate.checkQueries,
            objectTemplate.filter,
            objectTemplate.objectExists,
            objectTemplate.read
        ],
        update: [
            objectTemplate.objectExists,
            objectTemplate.requiredProperties,
            options.updateVerifications,
            objectTemplate.update
        ],
        delete: [
            objectTemplate.objectExists,
            options.deleteVerifications,
            objectTemplate.delete
        ],
        exists: [objectTemplate.objectExists]
    }
}

module.exports = controller