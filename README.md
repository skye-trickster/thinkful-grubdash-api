# Project: GrubDash

## Disclaimer

These instructions are copied and pasted from.

## Introduction

You've been hired as a backend developer for a new startup called GrubDash!
As another developer works on the design and frontend experience, you have been tasked with setting up an API and building out specific routes so that
the frontend developers can demo out some initial design ideas to the big bosses.

This project will test your ability to build APIs with complex validation.
To succeed at this project, you'll need to demonstrate that you can do the following:
- Run tests from the command line.
- Use common middleware packages.
- Receive requests through routes.
- Access relevant information through route parameters.
- Build an API following RESTful design principles.
- Write custom middleware functions.

You will not need to make any edits to HTML or CSS for this project.

## GrubDash frontend

While it is not required, if you would like to see this project connected to a frontend application, visit the following repository:

[Starter Code: GrubDash Front End](https://github.com/Thinkful-Ed/starter-grub-dash-front-end)

Instructions on how to get the frontend application up and running are included in the repository.

![Front-end example](https://res.cloudinary.com/strive/image/upload/w_1000,h_1000,c_limit/1fc7f916e2146e659f7934a73b103e25-home.png)

Again, it is not necessary to connect the frontend to successfully complete this project.

## Project setup

Follow the instructions below to get this project up and running on your own machine:

- Download the Qualified assessment files to your computer.
- Run `npm install` to install the project and run `git init` to initialize a Git repository.

## Running tests

To run the tests, you can run the following command:

```
npm test
```

## Instructions

Your goal for this lesson is to get the tests to pass.
To do so, you will be creating a server to access two resources, `dishes` and `orders`, in addition to error handling.
Your server should follow the structure that you've learned in the program. Complete the following tasks to pass the tests and this assessment.

### Existing files

| File Path                             | Description
| :-------                              | :-----------
| `src/app.js`                          | Contains the Express application. You will not need to make changes to this file.
| `src/data/dishes-data.js`             | Contains the dishes data. This is the shape of the dish data that the API will send and receive. You can add or remove dishes if you like.
| `src/data/orders-data.js`             | Contains the orders data. This is the shape of the order data that the API will send and receive. You can add or remove orders if you like.
| `src/dishes/dishes.controller.js`     | Add middleware and handlers for dishes to this file, then export the functions for use by the router.
| `src/dishes/dishes.router.js`         | Add routes and attach handlers to the router exported by this file.
| `src/errors/errorHandler.js`          | Exports the error handler function for use by the Express application.
| `src/errors/methodNotAllowed.js`      | Exports the 405 Method Not Allowed handler function for use by the Express application.
| `src/errors/notFound.js` 	            | Exports the 404 Not Found handler function for use by the Express application.
| `src/orders/orders.controller.js` 	| Add middleware and handlers for orders to this file, then export the functions for use by the router.
| `src/orders/orders.router.js` 	    | Add routes and attach handlers to the router exported by this file.
| `src/server.js` 	                    | Contains the server code. You will not need to make changes to this file.
| `src/utils/nextId.js` 	            | Exports the nextId function. Use this function anytime you need to assign a new id. You will not need to make changes to this file.
| `test/dishes-router.test.js` 	        | Tests for the dishes router. You will not need to make changes to this file.
| `test/order-router.test.js` 	        | Tests for the orders router. You will not need to make changes to this file.
| `test/make-test-app.js` 	            | Function used by the tests. You will not need to make changes to this file.

## Tasks

1. In the src/dishes/dishes.controller.js file, add handlers and middleware functions to create, read, update, and list dishes. Note that dishes cannot be deleted.
2. In the src/dishes/dishes.router.js file, add two routes: /dishes, and /dishes/:dishId and attach the handlers (create, read, update, and list) exported from src/dishes/dishes.controller.js.
3. In the src/orders/orders.controller.js file, add handlers and middleware functions to create, read, update, delete, and list orders.
4. In the src/orders/orders.router.js file, add two routes: /orders, and /orders/:orderId and attach the handlers (create, read, update, delete, and list) exported from src/orders/orders.controller.js.
5. Anytime you need to assign a new id to an order or dish, use the nextId function exported from src/utils/nextId.js

## Routes

To complete this project, you will create the following routes:

### `GET /dishes`

This route will respond with a list of all existing dish data.

Example request
```
GET http://localhost:5000/dishes
```
Example response
``` JSON
{
  "data": [
    {
      "id": "d351db2b49b69679504652ea1cf38241",
      "name": "Dolcelatte and chickpea spaghetti",
      "description": "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
      "price": 19,
      "image_url": "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350"
    }
  ]
}
```