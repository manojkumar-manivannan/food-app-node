import { Router } from 'express';
import FoodController from '../controllers/food.controller';
const router = Router();

router.get(
  '/seed',
  FoodController.seed,
);

router.get(
  '/',
  FoodController.getAll
);

router.get(
  '/search/:searchTerm',
  FoodController.search,
);

router.get(
  '/tags',
  FoodController.getTags,
);

router.get(
  '/tag/:tagName',
  FoodController.getFoodByTag,
);

router.get(
  '/:foodId',
  FoodController
    .getFoodById,
);

export default router;
