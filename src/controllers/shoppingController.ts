import express, { Request, Response, NextFunction } from 'express'
import { Vendor } from '../models'
import { FoodDoc } from '../models/Food'

export const getFoodAvailability = async (req: Request, res: Response) => {
  const { pincode } = req.params
  const result = await Vendor.find({ pincode, serviceAvailability: true })
    .sort([['rating', 'descending']])
    .populate('foods')

  if (result.length > 0) {
    return res.status(200).json(result)
  }

  return res.status(400).json({ message: 'data not found' })
}

export const getTopRestaurants = async (req: Request, res: Response) => {
  const { pincode } = req.params
  const result = await Vendor.find({ pincode, serviceAvailability: true })
    .sort([['rating', 'descending']])
    .limit(1)

  if (result.length > 0) {
    return res.status(200).json(result)
  }

  return res.status(400).json({ message: 'data not found' })
}

export const getFoodsIn30Minutes = async (req: Request, res: Response) => {
  const { pincode } = req.params
  const results = await Vendor.find({
    pincode,
    serviceAvailability: true,
  }).populate('foods')

  if (results.length > 0) {
    let foodResult = <any>[]
    results.map((vendor) => {
      const foods = [...vendor.foods] as [FoodDoc]
      foodResult.push(...foods.filter((food) => Number(food.readyTime) <= 30))
    })
    return res.status(200).json(foodResult)
  }
  return res.status(400).json({ message: 'data not found' })
}

export const searchFoods = async (req: Request, res: Response) => {
  const { pincode } = req.params
  const result = await Vendor.find({
    pincode,
    serviceAvailability: true,
  }).populate('foods')

  if (result.length > 0) {
    let foodResult = <any>[]
    result.map((result) => {
      const foods = [...result.foods]
      foodResult = foods
    })
    return res.status(200).json(foodResult)
  }

  return res.status(400).json({ message: 'data not found' })
}

export const getRestaurantById = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await Vendor.findById(id).populate('foods')
  if (result) {
    return res.status(200).json(result)
  }

  return res.status(400).json({ message: 'data not found' })
}
