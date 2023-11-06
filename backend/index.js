const connectDB = require("./database/db")
// Calling the function that manages the database
connectDB()

// initializing required dependencies
const express = require("express")

const routes = require('./routes/routes')

const cors = require("cors")

const cookieParser = require("cookie-parser")

const app = express()
/**
 * initializing backend port 5000
 */
app.listen(5000, () => {
    console.log("App is listening on port 5000 ");
})
// corns; allows us to control which client has access to the backend; the ex: http://localhost:4200
app.use(cors({
    credentials: true,
    origin:['http://localhost:4200']
}))
// Calling jwt token when initializing the app
app.use(cookieParser())
app.use(express.json())

app.use("/api", routes)

