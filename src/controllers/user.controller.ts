import { NextFunction, Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";

import { sample_users } from "../data";

let UserController = {
    seed: asyncHandler(async (req: Request, res: Response) => {
        const usersCount = await UserModel.countDocuments();
        if (usersCount > 0) {
            res.send("Seed is already done!");
            return;
        }

        await UserModel.create(sample_users);
        res.send("Seed Is Done!");
    }),

    login: asyncHandler(async (req: Request, res: any) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if(!user) return res.status(HTTP_BAD_REQUEST).send("User not found!");
        if(!user.isVerified) return res.status(HTTP_BAD_REQUEST).send("User not verified!");
        
        if (await bcrypt.compare(password, user.password)) {
            res.send(functions.generateTokenResponseUser(user));
        } else {
            res.status(HTTP_BAD_REQUEST).send(
                "Password is wrong!"
            );
        }
    }),

    register: asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { name, email, password, address } = req.body;
            const user = await UserModel.findOne({ email });
            console.log(user);
            if (user) {
                res.status(HTTP_BAD_REQUEST).send(
                    "User is already exist, please login!"
                );
                return;
            }

            const encryptedPassword = await bcrypt.hash(password, 10);
            const newUser: User = {
                id: "",
                name,
                email,
                password: encryptedPassword,
                address,
                isVerified: false,
            };
            const dbUser = await UserModel.create(newUser);

            const token = functions.generateTokenResponseEmail(email);

            res.locals.mailOptions = {
                from: `Food App @<${process.env.EMAIL_ID}>`,
                to: req.body.email,
                subject: "Account Verification",
                text: `Click the following link to verify your account for Food App: ${
                    process.env.SIGNUP_BASE_URL + "?token=" + token
                }`,
            };
            next();
            res.status(201).send({res:functions.generateTokenResponseEmail(email),link:process.env.SIGNUP_BASE_URL + "?token=" + token});
            return;
        }
    ),
    verify: asyncHandler(async (req: Request, res: any  ) => {
        console.log(req.body);
        let token;
        const bearerHeader = req.headers["authorization"];
        if (bearerHeader) token = bearerHeader.split(" ")[1];
        else return res.status(401).json({ message: "Unauthorized" });

        // Verify the token
        const decoded = (await jwt.verify(
            token,
            process.env.JWT_SECRET!
        )) as jwt.JwtPayload;
        const email = decoded.email;
        if (!email) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Get user record
        const user = await UserModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update user record
        user.isVerified = true;
        await user.save();

        // Generate token response
        const tokenResponse = functions.generateTokenResponseUser(user);
        res.status(200).json( tokenResponse );
    }),
};
let functions = {
    generateTokenResponseEmail: (email: String) => {
        const token = jwt.sign(
            {
                email: email,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "30d",
            }
        );

        return token
    },
    generateTokenResponseUser: (user: User) => {
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "30d",
            }
        );

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            address: user.address,
            token: token,
        };
    },
};

export default UserController;
