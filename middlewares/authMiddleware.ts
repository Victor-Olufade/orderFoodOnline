import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { appSecret } from '../config'
import { AuthPayLoad } from '../dto/auth.dto'
import { findVendor } from '../controllers'
import { VendorDto } from '../dto'
import { Customer } from '../models/Customer'

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization
      ? req.headers?.authorization
      : null
    const token = bearerToken?.slice(7) as string

    if(token == null || token == undefined){
        return res.status(401).json({
            Error: "Unauthorized"
        })
    }

    const verify = await jwt.verify(token, appSecret) as AuthPayLoad

    if(!verify){
        return res.status(400).json({
            Error: "unable to verify"
        })
    }

    const vendor = await findVendor(verify.id)

    if (vendor === null) {
      return res.status(401).json({
        Error: 'You are not authorized',
      })
    }

    req.user = vendor as AuthPayLoad
    next()
  } catch (error) {
    console.log(error);
    
  }
}


export const authCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken = req.headers.authorization
      ? req.headers?.authorization
      : null
    const token = bearerToken?.slice(7) as string

    if(token == null || token == undefined){
        return res.status(401).json({
            Error: "Unauthorized"
        })
    }

    try {
      const verify = await jwt.verify(token, appSecret) as AuthPayLoad

      if(!verify){
          return res.status(400).json({
              Error: "unable to verify"
          })
      }

      const customer = await Customer.findById(verify.id)

      if (customer === null) {
        return res.status(401).json({
          Error: 'You are not authorized',
        })
      }

      req.user = customer as AuthPayLoad
      next()
    } catch (error) {
      return res.status(400).json({
        Error: "Error verifying token",
        error
      })
    }
    
  } catch (error) {
    console.log(error);
    
  }
}
