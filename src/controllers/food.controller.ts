import { NextFunction, Router, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";
import { FoodModel } from "../models/food.model";
import { sample_foods } from "../data";

let FoodController = {
    seed: asyncHandler(async (req, res) => {
      const foodsCount = await FoodModel.countDocuments();
      if (foodsCount > 0) {
        res.send('Seed is already done!');
        return;
      }
  
      await FoodModel.create(sample_foods);
      res.send('Seed Is Done!');
    }),

    getAll: asyncHandler(async (req, res) => {
      const foods = await FoodModel.find();
      res.send(foods);
    }),

    search: asyncHandler(async (req, res) => {
      const searchRegex = new RegExp(req.params.searchTerm, 'i');
      const foods = await FoodModel.find({ name: { $regex: searchRegex } });
      res.send(foods);
    }),
    getFoodByTag: asyncHandler(async (req, res) => {
      const foods = await FoodModel.find({ tags: req.params.tagName });
      res.send(foods);
    }),
    getFoodById: asyncHandler(async (req, res) => {
      const food = await FoodModel.findById(req.params.foodId);
      res.send(food);
    } ),
    getTags:asyncHandler(async (req, res) => {
      const tags = await FoodModel.aggregate([
        {
          $unwind: '$tags',
        },
        {
          $group: {
            _id: '$tags',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: '$count',
          },
        },
      ]).sort({ count: -1 });
  
      const all = {
        name: 'All',
        count: await FoodModel.countDocuments(),
      };
  
      tags.unshift(all);
      res.send(tags);
    } ) 
}; 

export default FoodController;
