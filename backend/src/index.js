import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./db/connectDB.js"
dotenv.config({})
const app = express()
// middlewares 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cookieParser())
// app listening
const PORT = process.env.PORT || 3000
app.listen(PORT , ()=>{
    connectDB()
    console.log(`Server is listening at port :: ${PORT}`);
})