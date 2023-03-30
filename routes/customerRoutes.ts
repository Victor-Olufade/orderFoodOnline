import express from 'express';
import { EditProfile, GetProfile, Login, RequestOTP, Signup, Verify } from '../controllers';

const router = express.Router();

router.post('/signup', Signup)

router.post('/login', Login)

router.patch('/verify', Verify)

router.get('/requestOtp', RequestOTP)

router.get('/profile', GetProfile)

router.patch('/profile', EditProfile)

export {router as customerRouter}


