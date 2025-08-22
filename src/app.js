import dotenv from "dotenv";
dotenv.config(); // <-- loads .env variables


import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// app.use(cors)
// for production level
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,               // if you want to send cookies/auth headers
}));

// app.use(express.json())
app.use(express.json({limit:"20kb"}))//if data is come using json
app.use(express.urlencoded({extended: true, limit:"20kb"})) // if data is come using url
app.use(express.static("public"))   

// to perform crud ops and access the cokiees from user browser
app.use(cookieParser())

//routes import
import authRouter from './routes/auth.routes.js'
import guideRouter from './routes/guide.routes.js'
import gamifiedRouter from "./routes/gamification.routes.js"
import quizRoute from "./routes/quiz.routes.js"
import chatbotRoute from "./routes/chatbot.routes.js"

//routes declaration
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/guides",guideRouter)
app.use("/api/v1/gamified",gamifiedRouter)
app.use("/api/v1/quiz",quizRoute)
app.use("/api/v1/chatbot",chatbotRoute)


export {app}