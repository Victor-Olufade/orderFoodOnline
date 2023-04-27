import express from 'express'
import {
  EditProfile,
  GetProfile,
  CustomerLogin,
  RequestOTP,
  Signup,
  Verify,
  createOrder,
  getOrders,
  getOrderById,
  addToCart,
  getCart,
  deleteCart
} from '../controllers'
import { authCustomer } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/signup', Signup)

router.post('/login', CustomerLogin)

router.patch('/verify', authCustomer, Verify)

router.post('/requestOtp', RequestOTP)

router.get('/profile', authCustomer, GetProfile)

router.patch('/profile', authCustomer, EditProfile)

router.post('/create-order', authCustomer, createOrder)

router.get('/orders', authCustomer, getOrders)

router.get('/order/:id', authCustomer, getOrderById)

router.get('/cart', authCustomer, getCart)

router.post('/cart', authCustomer, addToCart)

router.delete('/cart', authCustomer, deleteCart)

export { router as customerRouter }
