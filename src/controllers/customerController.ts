import { CustomerDoc } from '../models/Customer'
import { generateSignature, validatePassword } from '../utility/helperFunctions'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response } from 'express'
import {
  CreateCustomerInputs,
  CustomerLoginInputs,
  EditCustomerInputs,
  OrderInputs,
  ResendInput,
} from '../dto/customer.dto'
import { Customer } from '../models/Customer'
import {
  generateSalt,
  generateHashedPassword,
} from '../utility/helperFunctions'
import {
  generateOtpAndExpiry,
  eHtml,
  sendEmail,
} from '../utility/notifications'
import { Food } from '../models/Food'
import { Order } from '../models/Order'

export const Signup = async (req: Request, res: Response) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body)
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  })
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors)
  }

  const { email, password, phone } = customerInputs

  const isExisting = await Customer.findOne({ email })

  if (isExisting !== null) {
    return res.status(400).json({
      Error: 'Customer already exists',
    })
  }

  const salt = await generateSalt()
  const hashedPassword = await generateHashedPassword(password, salt)
  const { otp, expiry } = generateOtpAndExpiry()

  try {
    const customer = await Customer.create({
      email,
      password: hashedPassword,
      phone,
      otp,
      otp_expiry: expiry,
      salt,
      firstName: '',
      lastName: '',
      verified: false,
      lat: 0,
      long: 0,
      address: '',
    })

    if (customer) {
      const body = eHtml(otp)
      try {
        await sendEmail(email, body)
      } catch (error) {
        console.log(error)
        return res.status(400).json({
          Error: 'Error sending mail',
          error,
        })
      }

      const signature = await generateSignature({
        id: customer.id,
        email,
        verified: customer.verified,
      })

      return res.status(201).json({
        signature,
        message: 'Sign up successful',
      })
    }
  } catch (error) {
    return res.status(400).json({
      Error: 'Error with signup',
      error,
    })
  }
}

export const CustomerLogin = async (req: Request, res: Response) => {
  const LoginInputs = plainToClass(CustomerLoginInputs, req.body)

  const { email, password } = LoginInputs
  const inputErrors = await validate(LoginInputs, {
    validationError: { target: true },
  })

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors)
  }

  const customer = (await Customer.findOne({ email })) as CustomerDoc

  if (!customer) {
    return res.status(400).json({
      Error: 'Invalid credentials',
    })
  }

  const isPassword = await validatePassword(customer?.password, password)

  if (!isPassword) {
    return res.status(401).json({
      Error: 'Password is incorrect',
    })
  }

  if (!customer.verified) {
    return res.status(400).json({
      Error: 'Please verify your account first',
    })
  }

  if (customer && isPassword) {
    const signature = await generateSignature({
      id: customer.id,
      email,
      verified: customer.verified,
    })

    return res.status(200).json({
      message: 'Login successful',
      signature,
      customer,
    })
  }

  return res.status(400).json({
    Error: 'Error logging in',
  })
}

export const Verify = async (req: Request, res: Response) => {
  const customer = req.user
  const { otp } = req.body

  if (!customer) {
    return res.status(400).json({
      Error: 'Customer not found',
    })
  }

  const customerProfile = await Customer.findById(customer.id)

  if (customerProfile!.verified) {
    return res.status(400).json({
      Error: 'customer already verified',
    })
  }

  if (
    Number(otp) === customerProfile!.otp &&
    customerProfile!.otp_expiry >= new Date()
  ) {
    customerProfile!.verified = true
    await customerProfile!.save()

    const signature = await generateSignature({
      id: customerProfile!.id,
      email: customerProfile!.email,
      verified: customerProfile!.verified,
    })

    return res.status(201).json({
      message: 'Customer has been verified',
      customerProfile,
      signature,
    })
  }

  return res.status(400).json({
    Error: 'otp expired',
  })
}

export const RequestOTP = async (req: Request, res: Response) => {
  const emailInput = plainToClass(ResendInput, req.body)
  const inputErrors = await validate(emailInput, {
    validationError: { target: true },
  })

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors)
  }
  const { email } = emailInput

  const customer = await Customer.findOne({ email })

  if (!customer) {
    return res.status(400).json({
      Error: 'customer does not exist',
    })
  }

  const { otp, expiry } = generateOtpAndExpiry()

  try {
    customer.otp = otp
    customer.otp_expiry = expiry
    await customer.save()
    const body = eHtml(otp)

    try {
      await sendEmail(email, body)
      const signature = await generateSignature({
        id: customer.id,
        email,
        verified: customer.verified,
      })
      return res.status(200).json({
        message: 'check your email for new OTP',
        signature,
      })
    } catch (error) {
      return res.status(400).json({
        Error: 'Error sending otp',
        error,
      })
    }
  } catch (error) {
    return res.status(400).json({
      Error: 'Error sending otp',
      error,
    })
  }
}

export const GetProfile = async (req: Request, res: Response) => {
  const customer = req.user!
  const customerProfile = await Customer.findById(customer.id)
  return res.status(200).json({
    customerProfile,
  })
}

export const EditProfile = async (req: Request, res: Response) => {
  const editInputs = plainToClass(EditCustomerInputs, req.body)

  const inputErrors = await validate(editInputs, {
    validationError: { target: true },
  })

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors)
  }

  const { address, lastName, firstName } = editInputs
  const customer = req.user!

  const customerProfile = await Customer.findById(customer.id)

  try {
    customerProfile!.address = address
    customerProfile!.lastName = lastName
    customerProfile!.firstName = firstName

    await customerProfile!.save()
    return res.status(201).json({
      message: 'update successful',
      customerProfile,
    })
  } catch (error) {
    return res.status(400).json({
      Error: 'Error updating profile',
      error,
    })
  }
}

export const createOrder = async (req: Request, res: Response) => {
  const customer = req.user
  if (!customer) {
    return res.status(401).json({
      Error: 'You are not authorized',
    })
  }

  const profile = await Customer.findById(customer.id)

  const cart = <[OrderInputs]>req.body

  const orderId = Math.floor(Math.random() * 89999) + 1000
  let cartItems = Array()
  let netAmount = 0

  const foods = await Food.find()
    .where('_id')
    .in(cart.map((item) => item.id))
    .exec()
  foods.map((food) => {
    cart.map(({ id, unit }) => {
      if (food.id == id) {
        netAmount += food.price * unit
        cartItems.push({ food, unit })
      }
    })
  })

  if (cartItems.length > 0) {
    const currentOrder = await Order.create({
      orderId,
      items: cartItems,
      totalAmount: netAmount,
      orderDate: new Date(),
      paidThrough: 'COD',
      paymentResponse: '',
      orderStatus: 'waiting',
    })

    if (!currentOrder) {
      return res.status(400).json({
        Error: 'Error creating order',
      })
    }

    profile?.orders.push(currentOrder)
    const orderResponse = await profile?.save()
    if (orderResponse)
      return res.status(201).json({
        orders: currentOrder,
      })
  }

  return res.status(400).json({
    Error: 'Cart is empty',
  })
}

export const getOrders = async (req: Request, res: Response) => {
  const customer = req.user
  if (!customer) {
    return res.status(401).json({
      Error: 'You are not authorized',
    })
  }

  const profile = await Customer.findById(customer.id).populate('orders')

  if (profile) {
    return res.status(200).json({
      orders: profile.orders,
    })
  }

  return res.status(401).json({
    Error: 'You are not authorized',
  })
}

export const getOrderById = async (req: Request, res: Response) => {
  const customer = req.user
  const { id } = req.params
  if (!customer) {
    return res.status(401).json({
      Error: 'You are not authorized',
    })
  }

  const order = await Order.findById(id).populate('items.food')

  if (order) {
    return res.status(200).json({
      order,
    })
  } else {
    return res.status(401).json({
      Error: 'You are not authorized',
    })
  }
}
