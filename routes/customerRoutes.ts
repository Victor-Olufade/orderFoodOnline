import express from 'express';
import { EditProfile, GetProfile, Login, RequestOTP, Signup, Verify } from '../controllers';
import { authCustomer } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/signup', Signup)

router.post('/login', Login)

router.patch('/verify', authCustomer, Verify)

router.get('/requestOtp', RequestOTP)

router.get('/profile', GetProfile)

router.patch('/profile', EditProfile)

export {router as customerRouter}


