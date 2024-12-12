import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import messageRoutes from "./models/message.model.js"
dotenv.config()
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT =process.env.PORT;
app.use("/api/auth" , authRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT, ()=>{
    console.log("server is running on PORT:" + PORT);
    connectDB()
});