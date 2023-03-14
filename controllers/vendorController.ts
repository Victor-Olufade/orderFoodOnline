import { VendorPayload } from './../dto/vendor.dto'
import { Request, Response, NextFunction } from 'express'
import { findVendor } from './adminController'
import { VendorLoginInputs, CreateFoodInputs } from '../dto'
import { validatePassword, generateSignature } from '../utility/helperFunctions'
import { editVendorInputs } from '../dto'
import { Food } from '../models/Food'

export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInputs>req.body
  const existingVendor = await findVendor('', email)

  if (existingVendor !== null) {
    const validPassword = await validatePassword(
      existingVendor.password,
      password
    )

    if (validPassword) {
      const { id, email, name, foodType } = existingVendor
      const signature = await generateSignature({ id, email, name, foodType })
      return res.status(200).json({ existingVendor, signature })
    } else {
      return res.status(401).json({
        Error: 'Password is invalid',
      })
    }
  }

  return res.status(404).json({
    Error: 'Vendor does not exist',
  })
}

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user

  return res.status(200).json(vendor)
}

export const editVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodType } = <editVendorInputs>req.body

  const vendor = req.user

  const existingVendor = await findVendor('', vendor?.email)

  if (existingVendor) {
    existingVendor.name = name
    existingVendor.address = address
    existingVendor.phone = phone
    existingVendor.foodType = foodType

    const savedVendor = await existingVendor.save()
    return res.status(200).json(savedVendor)
  }

  return res.status(200).json(existingVendor)
}

export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = req.user

  const existingVendor = await findVendor('', vendor?.email)

  if (existingVendor) {
    existingVendor.serviceAvailability = !existingVendor.serviceAvailability
    const savedVendor = await existingVendor.save()
    return res.status(200).json(savedVendor)
  }

  return res.status(404).json({
    Error: 'Vendor does not exist',
  })
}

export const updateVendorCoverImage = async (req: Request, res: Response) => {
  const user = req.user

  const vendor = await findVendor(user?.id)

  const files = req.files as Express.Multer.File[];
  const images = files.map((file: Express.Multer.File)=> file.path) as [string]

  if (vendor !== null) {
    vendor.coverImages = images;

    const updatedVendor = await vendor.save()
    return res.status(201).json(updatedVendor)
  }

  return res.status(404).json({
    Error: "Vendor not found"
  })
}

export const addFood = async (req: Request, res: Response) => {
  const user = req.user

  const { name, description, category, foodType, readyTime, price } = <
    CreateFoodInputs
  >req.body;
  const vendor = await findVendor(user?.id)

  const files = req.files as Express.Multer.File[];
  const images = files.map((file: Express.Multer.File)=> file.path)

  if (vendor !== null) {
    const food = await Food.create({
      vendorId: vendor.id,
      name,
      description,
      category,
      foodType,
      readyTime,
      rating: 0,
      price,
      imagesArr: images
    })

    vendor.foods.push(food)
    const vendorWithFood = await vendor.save()
    return res.status(201).json(vendorWithFood)
  }
}

export const getFoods = async (req: Request, res: Response) => {
  const { id } = req.user as VendorPayload

  try {
    const foods = await Food.find({ vendorId: id })
    if (foods.length === 0) {
      return res.status(200).json({
        Message: 'You have added no foods',
      })
    }
    return res.status(200).json(foods)
  } catch (error) {
    console.log(error)

    return res.status(400).json({
      Error: 'There was an error fetching foods',
    })
  }
}
