import express from 'express';
import { EditProfile, GetProfile, CustomerLogin, RequestOTP, Signup, Verify } from '../controllers';
import { authCustomer } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/signup', Signup)

router.post('/login', CustomerLogin)

router.patch('/verify', authCustomer, Verify)

router.post('/requestOtp', RequestOTP)

router.get('/profile', authCustomer, GetProfile)

router.patch('/profile', authCustomer, EditProfile)

export {router as customerRouter}


