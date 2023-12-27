import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { decode } from "punycode";
dotenv.config();
export default (req: any, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers['authorization'] as string;
    const token = bearerHeader?.split(' ')[1];
    if(!token) return res.status(HTTP_UNAUTHORIZED).send();
    try {
        const decodedUser = verify(token, process.env.JWT_SECRET!);
            // @ts-ignore
        req.user = decodedUser;
    } catch (error) {
        res.sendStatus(HTTP_UNAUTHORIZED) ;
    }

    return next();
}