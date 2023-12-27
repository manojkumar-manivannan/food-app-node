import { NextFunction ,Request,Response} from "express";
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import  asyncHandler from "express-async-handler";
const nodemailer = require("nodemailer");
require("dotenv").config();

export default asyncHandler (
    async(req: Request, res: Response, next: NextFunction) => {   
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const _=await transporter.sendMail(res.locals.mailOptions);
            transporter.close();
            next();
        }
);
