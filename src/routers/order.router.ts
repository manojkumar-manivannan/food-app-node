import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderStatus } from '../constants/order_status';
import { OrderModel } from '../models/order.model';
import auth from '../middlewares/auth.mid';
import OrderController from '../controllers/order.controller';

const router = Router();
router.use(auth);

router.post('/create',
OrderController.createOrder
)
router.get('/newOrderForCurrentUser',OrderController.getNewOrder )
router.post('/pay',OrderController.pay )
router.get('/track/:id', OrderController.track)

export default router;

