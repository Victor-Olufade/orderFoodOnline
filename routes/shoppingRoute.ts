import { getFoodAvailability, getFoodsIn30Minutes, getRestaurantById, getTopRestaurants, searchFoods } from './../controllers/shoppingController';
import express from 'express';

const router = express.Router();

router.get('/:pincode', getFoodAvailability)

router.get('/top-restaurants/:pincode', getTopRestaurants)

router.get('/foods-in-30-min/:pincode', getFoodsIn30Minutes)

router.get('/search/:pincode', searchFoods)

router.get('/restaurant/:id', getRestaurantById)

export {router as shooppingRouter}