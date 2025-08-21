import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use(cors)
// for production level
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
// app.use(express.json())
app.use(express.json({limit:"20kb"}))//if data is come using json
app.use(express.urlencoded({extended: true, limit:"20kb"})) // if data is come using url
app.use(express.static("public"))   

// to perform crud ops and access the cokiees from user browser
app.use(cookieParser())

//routes import
import userRouter from './routes/auth.routes.js'

//routes declaration
app.use("/api/v1/auth",userRouter)

export {app}