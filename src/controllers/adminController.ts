import { Request, Response, NextFunction } from 'express'
import {
  generateSalt,
  generateHashedPassword,
} from '../utility/helperFunctions'
import { VendorDto } from '../dto'
import { Vendor } from '../models'

export const findVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return Vendor.findOne({ email })
  } else {
    return Vendor.findById(id)
  }
}

export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    address,
    pincode,
    phone,
    email,
    foodType,
    password,
  } = <VendorDto>req.body

  const vendorExists = await findVendor('', email)

  if (vendorExists) {
    return res.status(400).json({
      Error: 'Vendor already exists',
    })
  }

  const salt = await generateSalt()
  const hashedPassword = await generateHashedPassword(password, salt)

  const createdVendor = await Vendor.create({
    name,
    ownerName,
    address,
    pincode,
    phone,
    email,
    foodType,
    password: hashedPassword,
    serviceAvailability: true,
    salt,
    rating: 0,
    coverImages: [],
    foods: [],
  })

  return res.status(201).json({ createdVendor })
}

export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find()

  if (vendors == null) {
    return res.json({
      message: 'No vendor data',
    })
  }

  return res.status(200).json(vendors)
}

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = await findVendor(req.params.id)

  if (vendor == null) {
    return res.status(400).json({
      Error: 'Vendor does not exist',
    })
  }

  return res.status(200).json(vendor)
}
