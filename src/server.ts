import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import foodRouter from './routers/food.router';
import userRouter from './routers/user.router';
import orderRouter from './routers/order.router';
import { dbConnect } from './configs/database.config';
dbConnect();

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    
}));
// allow all request cors


app.use(express.json())
 
app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'))
})

const port = process.env.PORT || 6000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})