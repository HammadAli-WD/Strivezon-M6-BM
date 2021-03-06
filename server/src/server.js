const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")

const booksRouter = require("./products")
////const usersRouter = require("./services/users")
//const authorsRouter = require("./services/authors")

/* const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers") */

const server = express()

const port = process.env.PORT || 3000

const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())

server.use(cors())

server.use("/products", booksRouter)
//server.use("/users", usersRouter)
//server.use("/authors", authorsRouter)

// ERROR HANDLERS MIDDLEWARES

/* server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler) */

console.log(listEndpoints(server))

mongoose
  .connect("mongodb://localhost:27017/StriveAmazon", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))