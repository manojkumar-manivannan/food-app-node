import {NextFunction, Router,Request,Response} from 'express';
  
const router = Router();
import dotenv from 'dotenv';
dotenv.config();
import UserController  from '../controllers/user.controller';
import mail from '../middlewares/mail.mid';
router.get("/seed",  UserController.seed);
router.post("/login",  UserController.login);
router.post('/register',  UserController.register,mail);
router.post("/verify", UserController.verify);
export default router;