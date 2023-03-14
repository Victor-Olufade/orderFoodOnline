import express,{Request, Response, NextFunction} from 'express';
import { vendorLogin, getVendorProfile, editVendorProfile, updateVendorService, addFood, getFoods } from '../controllers';
import { authUser } from '../middlewares/authMiddleware';
import { upload } from '../config';



const router = express.Router();

router.post('/login', vendorLogin)

router.get('/profile', authUser, getVendorProfile)

router.patch('/profile', authUser, editVendorProfile)

router.patch('/service', authUser, updateVendorService)

router.post('/food', authUser, upload.array('image'), addFood)

router.get('/food', authUser, getFoods)

router.get('/', (req: Request, res: Response)=>{
    res.json("Hello from vendor")
})




export {router as vendorRouter};